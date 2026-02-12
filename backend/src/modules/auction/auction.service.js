import AppError from "../../shared/errors/AppError.js";
import { findPlayerById } from "../player/player.repo.js";
import { findRoomById, findTeamInRoom } from "../room/room.repo.js";
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
