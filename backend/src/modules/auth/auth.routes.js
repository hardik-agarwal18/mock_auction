import express from "express";
import { registerSchema } from "./auth.validation.js";
import { validate } from "../../shared/middleware/validate.js";
import { me, login, register } from "./auth.controller.js";
import { loginSchema } from "./auth.validation.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, me);

export default router;
