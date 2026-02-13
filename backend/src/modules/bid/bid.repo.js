import prisma from "../../config/database.js";

export const createBid = (data, tx) => {
  return (tx || prisma).bid.create({
    data,
  });
};

export const findBidsByRoom = (roomId, tx) => {
  return (tx || prisma).bid.findMany({
    where: { roomId },
    orderBy: { createdAt: "asc" },
    include: {
      team: {
        select: {
          id: true,
          name: true,
        },
      },
      player: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const findBidsByPlayer = (playerId, tx) => {
  return (tx || prisma).bid.findMany({
    where: { playerId },
    orderBy: { createdAt: "asc" },
  });
};

export const findBidsByTeam = (teamId, tx) => {
  return (tx || prisma).bid.findMany({
    where: { teamId },
    orderBy: { createdAt: "asc" },
  });
};

export const countBidsByTeam = (roomId, tx) => {
  return (tx || prisma).bid.groupBy({
    by: ["teamId"],
    where: { roomId },
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
  });
};

export const findHighestBidInRoom = (roomId, tx) => {
  return (tx || prisma).bid.findFirst({
    where: { roomId },
    orderBy: { amount: "desc" },
  });
};

export const countBidsByRoom = (roomId, tx) => {
  return (tx || prisma).bid.count({
    where: { roomId },
  });
};
