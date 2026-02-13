import { auctionState } from "./auction.state.js";
import { closeCurrentPlayerService } from "./auction.service.js";
import { io } from "../../server.js";

const AUCTION_DURATION = 10000; // 10s
const ANTI_SNIPE_THRESHOLD = 3000; // last 3s
const ANTI_SNIPE_EXTENSION = 5000; // extend by 5s

export const startTimer = (roomId, hostId) => {
  const state = auctionState[roomId];
  if (!state) return;

  const now = Date.now();

  // Remaining time if timer already running
  const remaining = state.timeoutAt ? state.timeoutAt - now : AUCTION_DURATION;

  // Decide new timeoutAt
  if (remaining > 0 && remaining <= ANTI_SNIPE_THRESHOLD) {
    // Anti-sniping extension
    state.timeoutAt = now + ANTI_SNIPE_EXTENSION;
  } else {
    // Normal full reset
    state.timeoutAt = now + AUCTION_DURATION;
  }

  // Clear previous timeout + interval
  if (state.timer) clearTimeout(state.timer);
  if (state.interval) clearInterval(state.interval);

  // Emit countdown every second
  state.interval = setInterval(() => {
    const remainingSeconds = Math.max(
      0,
      Math.ceil((state.timeoutAt - Date.now()) / 1000),
    );

    io.to(roomId).emit("countdown", {
      remaining: remainingSeconds,
    });

    if (remainingSeconds <= 0) {
      clearInterval(state.interval);
    }
  }, 1000);

  // Auto-close when time's up
  state.timer = setTimeout(async () => {
    clearInterval(state.interval);

    try {
      await closeCurrentPlayerService(hostId, roomId);
    } catch (err) {
      console.error("Auto-close failed:", err.message);
    }
  }, state.timeoutAt - now);
};
