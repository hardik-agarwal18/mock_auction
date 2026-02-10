import AppError from "../../shared/errors/AppError.js";
import {
  createRoom,
  findRoomById,
  findTeamInRoom,
  createTeam,
} from "./room.repo.js";

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
