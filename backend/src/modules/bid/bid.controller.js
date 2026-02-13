import {
  getRoomAnalyticsService,
  getTeamLeaderboardService,
  getPlayerAnalyticsService,
} from "./bid.service.js";

export const getRoomAnalytics = async (req, res, next) => {
  try {
    const data = await getRoomAnalyticsService(req.params.roomId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getTeamLeaderboard = async (req, res, next) => {
  try {
    const data = await getTeamLeaderboardService(req.params.roomId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getPlayerAnalytics = async (req, res, next) => {
  try {
    const data = await getPlayerAnalyticsService(req.params.playerId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
