import prisma from "../../config/database.js";

export const createRoom = (data, tx) => {
  return (tx || prisma).auctionRoom.create({
    data,
  });
};

export const findRoomById = (id, tx) => {
  return (tx || prisma).auctionRoom.findUnique({
    where: { id },
    include: {
      teams: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
            },
          },
        },
      },
    },
  });
};

export const findTeamInRoom = (roomId, userId, tx) => {
  return (tx || prisma).team.findFirst({
    where: { roomId, userId },
  });
};

export const createTeam = (data, tx) => {
  return (tx || prisma).team.create({
    data,
  });
};

export const updateRoom = (roomId, data, tx) => {
  return (tx || prisma).auctionRoom.update({
    where: { id: roomId },
    data,
  });
};

export const updateTeam = (teamId, data, tx) => {
  return (tx || prisma).team.update({
    where: { id: teamId },
    data,
  });
};

export const findTeamById = (teamId, tx) => {
  return (tx || prisma).team.findUnique({
    where: { id: teamId },
  });
};

export const findMostExpensivePlayer = (roomId, tx) => {
  return (tx || prisma).roomPlayer.findFirst({
    where: {
      roomId,
      status: "SOLD",
    },
    orderBy: {
      soldPrice: "desc",
    },
  });
};

export const getTotalAuctionValue = (roomId, tx) => {
  return (tx || prisma).roomPlayer.aggregate({
    where: {
      roomId,
      status: "SOLD",
    },
    _sum: {
      soldPrice: true,
    },
  });
};

export const findTeamsByRoom = (roomId, tx) => {
  return (tx || prisma).team.findMany({
    where: { roomId },
    include: {
      teamPlayers: true,
      bids: true,
    },
  });
};
