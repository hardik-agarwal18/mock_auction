import {
  findHighestBidInRoom,
  findBidsByPlayer,
  countBidsByRoom,
} from "./bid.repo.js";
import {
  findMostExpensivePlayer,
  getTotalAuctionValue,
  findTeamsByRoom,
} from "../room/room.repo.js";
import { findPlayerById } from "../player/player.repo.js";

/* =========================================
   ROOM OVERVIEW ANALYTICS
========================================= */
export const getRoomAnalyticsService = async (roomId) => {
  const [totalBids, highestBid, mostExpensivePlayer, totalAuctionValue] =
    await Promise.all([
      countBidsByRoom(roomId),
      findHighestBidInRoom(roomId),
      findMostExpensivePlayer(roomId),
      getTotalAuctionValue(roomId),
    ]);

  return {
    totalBids,
    highestBid: highestBid?.amount || 0,
    mostExpensivePlayer,
    totalAuctionValue: totalAuctionValue._sum.soldPrice || 0,
  };
};

/* =========================================
   TEAM LEADERBOARD
========================================= */
export const getTeamLeaderboardService = async (roomId) => {
  const teams = await findTeamsByRoom(roomId);

  return teams
    .map((team) => {
      const totalSpend = team.teamPlayers.reduce((sum, p) => sum + p.price, 0);

      const totalBids = team.bids.length;

      return {
        teamId: team.id,
        teamName: team.name,
        totalSpend,
        playersBought: team.teamPlayers.length,
        remainingBudget: team.budget,
        totalBids,
      };
    })
    .sort((a, b) => b.totalSpend - a.totalSpend);
};

/* =========================================
   PLAYER ANALYTICS
========================================= */
export const getPlayerAnalyticsService = async (playerId) => {
  const bids = await findBidsByPlayer(playerId);

  const player = await findPlayerById(playerId);

  return {
    totalBids: bids.length,
    finalPrice: player?.soldPrice || 0,
    basePrice: player?.basePrice || 0,
    priceIncreasePercent:
      player?.soldPrice && player?.basePrice
        ? ((player.soldPrice - player.basePrice) / player.basePrice) * 100
        : 0,
    bidTimeline: bids,
  };
};
