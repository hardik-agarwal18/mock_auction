import express from "express";
import {
  getRoomAnalytics,
  getTeamLeaderboard,
  getPlayerAnalytics,
} from "./bid.controller.js";

const router = express.Router();

router.get("/room/:roomId", getRoomAnalytics);

router.get("/leaderboard/:roomId", getTeamLeaderboard);

router.get("/player/:playerId", getPlayerAnalytics);

export default router;
