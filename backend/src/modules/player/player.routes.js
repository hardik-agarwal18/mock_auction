import express from "express";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { createPlayerSchema } from "./player.validation.js";
import { addPlayer, getPlayers } from "./player.controller.js";

const router = express.Router();

router.post("/:roomId", authenticate, validate(createPlayerSchema), addPlayer);

router.get("/:roomId", authenticate, getPlayers);

export default router;
