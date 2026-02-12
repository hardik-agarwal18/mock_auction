import express from "express";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes.js";
import roomRoutes from "./modules/room/room.routes.js";
import playerRoutes from "./modules/player/player.routes.js";
import auctionRoutes from "./modules/auction/auction.routes.js";
import errorMiddleware from "./shared/middleware/error.middleware.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/auction", auctionRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Global error handler (LAST)
app.use(errorMiddleware);

export default app;
