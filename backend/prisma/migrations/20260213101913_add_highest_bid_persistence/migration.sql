-- AlterTable
ALTER TABLE "AuctionRoom" ADD COLUMN     "currentHighestBid" INTEGER,
ADD COLUMN     "currentHighestBidder" TEXT,
ADD COLUMN     "currentPlayerId" TEXT;
