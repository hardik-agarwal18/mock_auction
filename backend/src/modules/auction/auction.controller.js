import { placeBidService } from "./auction.service.js";

export const placeBid = async (req, res, next) => {
  try {
    const { amount } = req.body;

    const result = await placeBidService(
      req.user.id,
      req.params.roomId,
      amount,
    );

    res.json({
      success: true,
      highestBid: result.highestBid,
      highestBidder: result.highestBidder,
    });
  } catch (err) {
    next(err);
  }
};
