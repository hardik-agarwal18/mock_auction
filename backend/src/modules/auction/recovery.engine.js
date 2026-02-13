import { auctionState } from "./auction.state.js";
import { startTimer } from "./timer.engine.js";
import prisma from "../../config/database.js";

export const recoverLiveAuctions = async () => {
  const liveRooms = await prisma.auctionRoom.findMany({
    where: { status: "LIVE" },
  });

  for (const room of liveRooms) {
    if (!room.currentPlayerId) continue;

    auctionState[room.id] = {
      highestBid: 0, // we don't persist this yet
      highestBidder: null,
      timer: null,
      interval: null,
      timeoutAt: null,
    };

    console.log(`Recovering auction for room ${room.id}`);

    startTimer(room.id, room.hostId);
  }
};
