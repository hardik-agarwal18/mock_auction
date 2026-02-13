-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Bid_roomId_idx" ON "Bid"("roomId");

-- CreateIndex
CREATE INDEX "Bid_teamId_idx" ON "Bid"("teamId");

-- CreateIndex
CREATE INDEX "Bid_playerId_idx" ON "Bid"("playerId");

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "AuctionRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "RoomPlayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
