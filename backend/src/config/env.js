import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const DB_URI = process.env.DATABASE_URL || "";
export const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";

if (!PORT) {
  throw new Error("PORT is not defined in environment variables");
}

if (!DB_URI) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}
