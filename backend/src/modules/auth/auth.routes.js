import express from "express";
import { registerSchema } from "./auth.validation.js";
import { validate } from "../../shared/middleware/validate.js";
import { register } from "./auth.controller.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);

export default router;
