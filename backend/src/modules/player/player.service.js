import { findPlayersByRoom, createPlayer } from "./player.repo.js";
import { findRoomById } from "../room/room.repo.js";
import AppError from "../../shared/errors/AppError.js";

export const addPlayerService = async (userId, roomId, data) => {
  const room = await findRoomById(roomId);

  if (!room) {
    throw new AppError("Room not found", 404);
  }

  if (room.hostId !== userId) {
    throw new AppError("Only host can add players", 403);
  }

  if (room.status !== "WAITING") {
    throw new AppError("Cannot add players after auction starts", 400);
  }

  return createPlayer({
    ...data,
    roomId,
  });
};

export const getPlayersService = async (roomId) => {
  const room = await findRoomById(roomId);

  if (!room) {
    throw new AppError("Room not found", 404);
  }

  return findPlayersByRoom(roomId);
};
