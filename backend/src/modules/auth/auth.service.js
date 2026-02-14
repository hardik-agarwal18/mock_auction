import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../../shared/errors/AppError.js";
import { JWT_SECRET } from "../../config/env.js";
import {
  findUserByEmail,
  createUser,
  findUserById,
  findUserByUsername,
  findUserByEmailOrUsername,
} from "./auth.repo.js";

export const registerUser = async ({ email, password, username }) => {
  const existingEmail = await findUserByEmail(email);

  if (existingEmail) {
    throw new AppError("Email already registered", 400);
  }

  const existingUsername = await findUserByUsername(username);

  if (existingUsername) {
    throw new AppError("Username already taken", 400);
  }

  const hashed = await bcrypt.hash(password, 10);

  return createUser({
    email,
    password: hashed,
    username,
  });
};

export const loginUser = async ({ email, password }) => {
  // Accept email or username for login
  const user = await findUserByEmailOrUsername(email);

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

  return { token };
};

export const getCurrentUser = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};
