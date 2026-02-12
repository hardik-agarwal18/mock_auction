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

  if (currentState.highestBid === 0) {
    if (amount < player.basePrice) {
      throw new AppError("Bid must be >= base price", 400);
    }
  } else {
    if (amount <= currentState.highestBid) {
      throw new AppError("Bid must be higher than current bid", 400);
    }
  }

  // Update in-memory state
  auctionState[roomId] = {
    highestBid: amount,
    highestBidder: team.id,
  };

  return auctionState[roomId];
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

  const player = await findPlayerById(room.currentPlayerId);

  if (!player || player.status !== "ACTIVE") {
    throw new AppError("Player not active", 400);
  }

  const state = auctionState[roomId];

  if (!state) {
    throw new AppError("Auction state missing", 500);
  }

  // ======================
  // CASE 1: NO BIDS
  // ======================
  if (state.highestBid === 0) {
    await updatePlayer(player.id, {
      status: "UNSOLD",
    });
  }
  // ======================
  // CASE 2: SOLD
  // ======================
  else {
    const team = await findTeamById(state.highestBidder);

    if (!team) {
      throw new AppError("Winning team not found", 500);
    }

    // Update player
    await updatePlayer(player.id, {
      status: "SOLD",
      soldPrice: state.highestBid,
      soldToTeamId: team.id,
    });

    // Deduct budget
    await updateTeam(team.id, {
      budget: team.budget - state.highestBid,
    });

    // Create purchase record
    await createTeamPlayer({
      teamId: team.id,
      playerId: player.id,
      price: state.highestBid,
    });
  }

  // ======================
  // MOVE TO NEXT PLAYER
  // ======================
  const nextPlayer = await findNextUpcomingPlayer(roomId);

  if (nextPlayer) {
    await updatePlayer(nextPlayer.id, {
      status: "ACTIVE",
    });

    await updateRoom(roomId, {
      currentPlayerId: nextPlayer.id,
    });

    auctionState[roomId] = {
      highestBid: 0,
      highestBidder: null,
    };

    return {
      message: "Moved to next player",
      nextPlayerId: nextPlayer.id,
    };
  }

  // ======================
  // AUCTION COMPLETED
  // ======================
  await updateRoom(roomId, {
    status: "COMPLETED",
    currentPlayerId: null,
  });

  delete auctionState[roomId];

  return {
    message: "Auction completed",
  };
};
