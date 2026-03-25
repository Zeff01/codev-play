import { Router } from "express";
import { register, login, logout } from "@/controllers/auth.controller.";
import { registerValidation, loginValidation } from "@/middleware/validators/auth.validator";

const router = Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/logout", logout);

export default router;
