import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../../shared/errors/AppError.js";
import { JWT_SECRET } from "../../config/env.js";
import { findUserByEmail, createUser } from "./auth.repo.js";

export const registerUser = async ({ email, password, username }) => {
  const existing = await findUserByEmail(email);

  if (existing) {
    throw new AppError("User already exists", 400);
  }

  const hashed = await bcrypt.hash(password, 10);

  return createUser({
    email,
    password: hashed,
    username,
  });
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);

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
