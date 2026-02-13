import { auctionState } from "./auction.state.js";
import { closeCurrentPlayerService } from "./auction.service.js";
import { io } from "../../server.js";

const AUCTION_DURATION = 10000; // 10 seconds

export const startTimer = (roomId, hostId) => {
  const state = auctionState[roomId];

  if (!state) return;

  if (state.timer) {
    clearTimeout(state.timer);
  }

  state.timeoutAt = Date.now() + AUCTION_DURATION;

  // Emit countdown every second
  const interval = setInterval(() => {
    const remaining = Math.max(
      0,
      Math.floor((state.timeoutAt - Date.now()) / 1000),
    );

    io.to(roomId).emit("countdown", { remaining });

    if (remaining <= 0) {
      clearInterval(interval);
    }
  }, 1000);

  state.timer = setTimeout(async () => {
    clearInterval(interval);

    try {
      await closeCurrentPlayerService(hostId, roomId);
    } catch (err) {
      console.error("Auto-close failed:", err.message);
    }
  }, AUCTION_DURATION);
};
