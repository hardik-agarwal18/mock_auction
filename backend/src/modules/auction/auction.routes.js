import express from "express";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { placeBid } from "./auction.controller.js";
import { bidSchema } from "./auction.validation.js";

const router = express.Router();

router.post("/:roomId/bid", authenticate, validate(bidSchema), placeBid);

export default router;
