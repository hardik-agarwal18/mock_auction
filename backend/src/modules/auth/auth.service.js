import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "./auth.repo.js";

export const registerUser = async ({ email, password, username }) => {
  const existing = await findUserByEmail(email);

  if (existing) {
    throw new Error("User already exists");
  }

  const hashed = await bcrypt.hash(password, 10);

  return createUser({
    email,
    password: hashed,
    username,
  });
};
