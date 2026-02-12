import AppError from "../../shared/errors/AppError.js";
import {
  createRoom,
  findRoomById,
  findTeamInRoom,
  createTeam,
  updateRoom,
} from "./room.repo.js";
import {
  findFirstUpcomingPlayer,
  updatePlayerStatus,
} from "../player/player.repo.js";
import { auctionState } from "../auction/auction.state.js";

export const createRoomService = async (userId, data) => {
  const room = await createRoom({
    ...data,
    hostId: userId,
  });

  await createTeam({
    roomId: room.id,
    userId,
    name: "Host Team",
    budget: room.purse,
  });

  return room;
};

export const joinRoomService = async (userId, roomId) => {
  const room = await findRoomById(roomId);

  if (!room) {
    throw new AppError("Room not found", 404);
  }

  if (room.status !== "WAITING") {
    throw new AppError("Cannot join active room", 400);
  }

  const existing = await findTeamInRoom(roomId, userId);

  if (existing) {
    throw new AppError("User already joined this room", 400);
  }

  const team = await createTeam({
    roomId,
    userId,
    name: "Team",
    budget: room.purse,
  });

  return team;
};

export const getRoomService = async (roomId) => {
  const room = await findRoomById(roomId);

  if (!room) {
    throw new AppError("Room not found", 404);
  }

  return room;
};

export const startRoomService = async (userId, roomId) => {
  const room = await findRoomById(roomId);

  if (!room) {
    throw new AppError("Room not found", 404);
  }

  if (room.hostId !== userId) {
    throw new AppError("Only host can start the auction", 403);
  }

  if (room.status !== "WAITING") {
    throw new AppError("Room already started", 400);
  }

  const firstPlayer = await findFirstUpcomingPlayer(roomId);

  if (!firstPlayer) {
    throw new AppError("No players available to start auction", 400);
  }

  // Activate first player
  await updatePlayerStatus(firstPlayer.id, "ACTIVE");

  // Update room
  const updatedRoom = await updateRoom(roomId, {
    status: "LIVE",
    currentPlayerId: firstPlayer.id,
  });

  auctionState[roomId] = {
    highestBid: 0,
    highestBidder: null,
  };

  return updatedRoom;
};
