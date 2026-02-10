import prisma from "../../config/database.js";

export const createRoom = (data) => {
  return prisma.auctionRoom.create({
    data,
  });
};

export const findRoomById = (id) => {
  return prisma.auctionRoom.findUnique({
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

export const findTeamInRoom = (roomId, userId) => {
  return prisma.team.findFirst({
    where: { roomId, userId },
  });
};

export const createTeam = (data) => {
  return prisma.team.create({
    data,
  });
};
