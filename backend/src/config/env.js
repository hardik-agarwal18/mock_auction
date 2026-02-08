import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const DB_URI = process.env.DATABASE_URL || "";
export const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";
