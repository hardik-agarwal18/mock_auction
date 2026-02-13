import { auctionState } from "./auction.state.js";
import { closeCurrentPlayerService } from "./auction.service.js";

const AUCTION_DURATION = 10000; // 10 seconds

export const startTimer = (roomId, hostId) => {
  const state = auctionState[roomId];

  if (!state) return;

  if (state.timer) {
    clearTimeout(state.timer);
  }

  state.timeoutAt = Date.now() + AUCTION_DURATION;

  state.timer = setTimeout(async () => {
    try {
      await closeCurrentPlayerService(hostId, roomId);
    } catch (err) {
      console.error("Auto-close failed:", err.message);
    }
  }, AUCTION_DURATION);
};
