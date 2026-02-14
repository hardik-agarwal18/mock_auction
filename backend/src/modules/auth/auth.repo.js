import prisma from "../../config/database.js";

export const findUserByEmail = (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = (data) => {
  return prisma.user.create({
    data,
  });
};

export const findUserById = (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const findUserByUsername = (username) => {
  return prisma.user.findUnique({
    where: { username },
  });
};

export const findUserByEmailOrUsername = (identifier) => {
  return prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });
};
