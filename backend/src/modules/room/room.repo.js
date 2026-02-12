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

export const updateRoom = (roomId, data) => {
  return prisma.auctionRoom.update({
    where: { id: roomId },
    data,
  });
};

export const updateTeam = (teamId, data) => {
  return prisma.team.update({
    where: { id: teamId },
    data,
  });
};

export const findTeamById = (teamId) => {
  return prisma.team.findUnique({
    where: { id: teamId },
  });
};
