import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env.js";
import AppError from "../errors/AppError.js";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Authorization header missing", 401);
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new AppError("Invalid authorization format", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Token missing", 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded?.userId) {
      throw new AppError("Invalid token payload", 401);
    }

    req.user = { id: decoded.userId };

    next();
  } catch (err) {
    // Handle JWT specific errors cleanly
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Token expired", 401));
    }

    if (err.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token", 401));
    }

    next(err);
  }
};
