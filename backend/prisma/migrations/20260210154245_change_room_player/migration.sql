/*
  Warnings:

  - You are about to drop the column `isSold` on the `RoomPlayer` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PlayerStatus" AS ENUM ('UPCOMING', 'ACTIVE', 'SOLD', 'UNSOLD');

-- AlterTable
ALTER TABLE "RoomPlayer" DROP COLUMN "isSold",
ADD COLUMN     "soldPrice" INTEGER,
ADD COLUMN     "soldToTeamId" TEXT,
ADD COLUMN     "status" "PlayerStatus" NOT NULL DEFAULT 'UPCOMING';

-- CreateIndex
CREATE INDEX "RoomPlayer_roomId_idx" ON "RoomPlayer"("roomId");
