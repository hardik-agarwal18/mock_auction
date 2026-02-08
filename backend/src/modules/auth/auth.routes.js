import express from "express";
import { registerSchema } from "./auth.validation.js";
import { validate } from "../../shared/middleware/validate.js";
import { register } from "./auth.controller.js";
import { login } from "./auth.controller.js";
import { loginSchema } from "./auth.validation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

export default router;
