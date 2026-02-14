-- CreateTable
CREATE TABLE "PlayerStats" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "matchesPlayed" INTEGER,
    "innings" INTEGER,
    "runs" INTEGER,
    "highestScore" INTEGER,
    "battingAverage" DOUBLE PRECISION,
    "strikeRate" DOUBLE PRECISION,
    "centuries" INTEGER,
    "halfCenturies" INTEGER,
    "wickets" INTEGER,
    "bowlingAverage" DOUBLE PRECISION,
    "economyRate" DOUBLE PRECISION,
    "bestBowling" TEXT,
    "fiveWickets" INTEGER,
    "catches" INTEGER,
    "runOuts" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerStats_playerId_key" ON "PlayerStats"("playerId");

-- CreateIndex
CREATE INDEX "PlayerStats_playerId_idx" ON "PlayerStats"("playerId");

-- AddForeignKey
ALTER TABLE "PlayerStats" ADD CONSTRAINT "PlayerStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "RoomPlayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
