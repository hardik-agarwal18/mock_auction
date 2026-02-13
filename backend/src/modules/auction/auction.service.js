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
import prisma from "../../config/database.js";

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

  // Update in-memory state
  auctionState[roomId] = {
    highestBid: amount,
    highestBidder: team.id,
  };

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

  return prisma.$transaction(async (tx) => {
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

      await updateRoom(roomId, { currentPlayerId: nextPlayer.id }, tx);

      auctionState[roomId] = {
        highestBid: 0,
        highestBidder: null,
      };

      return {
        message: "Moved to next player",
        nextPlayerId: nextPlayer.id,
      };
    }

    await updateRoom(
      roomId,
      {
        status: "COMPLETED",
        currentPlayerId: null,
      },
      tx,
    );

    delete auctionState[roomId];

    return { message: "Auction completed" };
  });
};
