import express from "express";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { createRoomSchema } from "./room.validation.js";
import { createRoom, getRoom, joinRoom } from "./room.controller.js";

const router = express.Router();

router.post("/", authenticate, validate(createRoomSchema), createRoom);
router.post("/:roomId/join", authenticate, joinRoom);
router.get("/:roomId", authenticate, getRoom);

export default router;
