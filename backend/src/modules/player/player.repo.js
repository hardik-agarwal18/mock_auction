import prisma from "../../config/database.js";

export const createPlayer = (data, tx) => {
  return (tx || prisma).roomPlayer.create({
    data,
  });
};

export const findPlayersByRoom = (roomId, tx) => {
  return (tx || prisma).roomPlayer.findMany({
    where: { roomId },
    orderBy: { createdAt: "asc" },
  });
};

export const findPlayerById = (id, tx) => {
  return (tx || prisma).roomPlayer.findUnique({
    where: { id },
  });
};

export const createManyPlayers = (data, tx) => {
  return (tx || prisma).roomPlayer.createMany({
    data,
  });
};

export const findFirstUpcomingPlayer = (roomId, tx) => {
  return (tx || prisma).roomPlayer.findFirst({
    where: {
      roomId,
      status: "UPCOMING",
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const updatePlayerStatus = (playerId, status, tx) => {
  return (tx || prisma).roomPlayer.update({
    where: { id: playerId },
    data: { status },
  });
};

export const updatePlayer = (playerId, data, tx) => {
  return (tx || prisma).roomPlayer.update({
    where: { id: playerId },
    data,
  });
};

export const findNextUpcomingPlayer = (roomId, tx) => {
  return (tx || prisma).roomPlayer.findFirst({
    where: {
      roomId,
      status: "UPCOMING",
    },
    orderBy: { createdAt: "asc" },
  });
};

export const createTeamPlayer = (data, tx) => {
  return (tx || prisma).teamPlayer.create({
    data,
  });
};

export const countPlayersByTeam = (teamId, tx) => {
  return (tx || prisma).teamPlayer.count({
    where: { teamId },
  });
};
