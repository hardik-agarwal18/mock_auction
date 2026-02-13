import AppError from "../../shared/errors/AppError.js";
import {
  findPlayerById,
  updatePlayer,
  findNextUpcomingPlayer,
  createTeamPlayer,
} from "../player/player.repo.js";
import {
  findRoomById,
  updateRoom,
  findTeamById,
  updateTeam,
  findTeamInRoom,
} from "../room/room.repo.js";
import { auctionState } from "./auction.state.js";
import { getMinimumIncrement } from "./priceLadder.js";
import { startTimer } from "./timer.engine.js";
import prisma from "../../config/database.js";
import { io } from "../../server.js";
import { createBid } from "../bid/bid.repo.js";

export const placeBidService = async (userId, roomId, amount) => {
  const room = await findRoomById(roomId);

  if (!room) {
    throw new AppError("Room not found", 404);
  }

  if (room.status !== "LIVE") {
    throw new AppError("Auction not live", 400);
  }

  if (!room.currentPlayerId) {
    throw new AppError("No active player", 400);
  }

  const player = await findPlayerById(room.currentPlayerId);

  if (!player || player.status !== "ACTIVE") {
    throw new AppError("Player not active", 400);
  }

  const team = await findTeamInRoom(roomId, userId);

  if (!team) {
    throw new AppError("User not part of this room", 403);
  }

  if (team.budget < amount) {
    throw new AppError("Insufficient budget", 400);
  }

  const currentState = auctionState[roomId];

  if (!currentState) {
    throw new AppError("Auction state not initialized", 500);
  }

  // Prevent same team from bidding consecutively
  if (currentState.highestBidder === team.id) {
    throw new AppError("You are already the highest bidder", 400);
  }

  let currentPrice = currentState.highestBid;

  if (currentPrice === 0) {
    currentPrice = player.basePrice;
  }

  if (amount <= currentPrice) {
    throw new AppError("Bid too low (race condition)", 400);
  }

  const minIncrement = getMinimumIncrement(currentPrice);

  // If first bid, allow basePrice
  if (currentState.highestBid === 0) {
    if (amount < player.basePrice) {
      throw new AppError("Bid must be at least base price", 400);
    }
  } else {
    if (amount < currentPrice + minIncrement) {
      throw new AppError(
        `Bid must be at least ${minIncrement} higher than current price`,
        400,
      );
    }
  }

  // // Prevent same team from bidding same amount again
  // if (
  //   currentState.highestBidder === team.id &&
  //   currentState.highestBid === amount
  // ) {
  //   throw new AppError("You already placed this bid", 400);
  // }

  await createBid({
    roomId,
    playerId: room.currentPlayerId,
    teamId: team.id,
    amount,
  });

  // Update in-memory state
  currentState.highestBid = amount;
  currentState.highestBidder = team.id;

  await updateRoom(roomId, {
    currentHighestBid: amount,
    currentHighestBidder: team.id,
  });

  io.to(roomId).emit("newBid", {
    highestBid: amount,
    highestBidder: team.id,
  });

  // Restart timer
  startTimer(roomId, room.hostId);

  return {
    highestBid: amount,
    highestBidder: team.id,
  };
};

export const closeCurrentPlayerService = async (userId, roomId) => {
  const room = await findRoomById(roomId);

  if (!room) {
    throw new AppError("Room not found", 404);
  }

  if (room.hostId !== userId) {
    throw new AppError("Only host can close the round", 403);
  }

  if (room.status !== "LIVE") {
    throw new AppError("Auction not live", 400);
  }

  if (!room.currentPlayerId) {
    throw new AppError("No active player", 400);
  }

  const state = auctionState[roomId];

  if (!state) {
    throw new AppError("Auction state missing", 500);
  }

  const result = await prisma.$transaction(async (tx) => {
    const player = await findPlayerById(room.currentPlayerId, tx);

    if (!player || player.status !== "ACTIVE") {
      throw new AppError("Player not active", 400);
    }

    // ======================
    // NO BIDS
    // ======================
    if (state.highestBid === 0) {
      await updatePlayer(player.id, { status: "UNSOLD" }, tx);
    }
    // ======================
    // SOLD
    // ======================
    else {
      const team = await findTeamById(state.highestBidder, tx);

      if (!team) throw new AppError("Winning team not found", 500);

      // Revalidate budget inside transaction
      if (team.budget < state.highestBid)
        throw new AppError("Insufficient budget during close", 400);

      await updatePlayer(
        player.id,
        {
          status: "SOLD",
          soldPrice: state.highestBid,
          soldToTeamId: team.id,
        },
        tx,
      );

      await updateTeam(
        team.id,
        {
          budget: team.budget - state.highestBid,
        },
        tx,
      );

      await createTeamPlayer(
        {
          teamId: team.id,
          playerId: player.id,
          price: state.highestBid,
        },
        tx,
      );
    }

    const nextPlayer = await findNextUpcomingPlayer(roomId, tx);

    if (nextPlayer) {
      await updatePlayer(nextPlayer.id, { status: "ACTIVE" }, tx);

      await updateRoom(
        roomId,
        {
          currentPlayerId: nextPlayer.id,
          currentHighestBid: null,
          currentHighestBidder: null,
        },
        tx,
      );

      // Reset in-memory state
      state.highestBid = 0;
      state.highestBidder = null;

      return {
        type: "NEXT",
        nextPlayerId: nextPlayer.id,
      };
    }

    // ======================
    // AUCTION COMPLETED
    // ======================
    await updateRoom(
      roomId,
      {
        status: "COMPLETED",
        currentPlayerId: null,
        currentHighestBid: null,
        currentHighestBidder: null,
      },
      tx,
    );

    return { type: "COMPLETED" };
  });

  if (result.type === "NEXT") {
    io.to(roomId).emit("nextPlayer", {
      playerId: result.nextPlayerId,
    });

    startTimer(roomId, room.hostId);

    return {
      message: "Moved to next player",
      nextPlayerId: result.nextPlayerId,
    };
  }

  // Auction completed, clean up state
  if (state.timer) clearTimeout(state.timer);
  if (state.interval) clearInterval(state.interval);

  delete auctionState[roomId];

  io.to(roomId).emit("auctionCompleted");

  return { message: "Auction completed" };
};
