import prisma from "../../config/database.js";

export const createPlayer = (data) => {
  return prisma.roomPlayer.create({
    data,
  });
};

export const findPlayersByRoom = (roomId) => {
  return prisma.roomPlayer.findMany({
    where: { roomId },
    orderBy: { createdAt: "asc" },
  });
};

export const findPlayerById = (id) => {
  return prisma.roomPlayer.findUnique({
    where: { id },
  });
};

export const createManyPlayers = (data) => {
  return prisma.roomPlayer.createMany({
    data,
  });
};
