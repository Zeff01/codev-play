import { Router } from "express";
import { register, login } from "../controllers/authController";
import {
  registerValidation,
  loginValidation,
} from "../middleware/validators/auth.validator";

const router = Router();

router.post("/register", registerValidation, register);
router.post("/login",loginValidation, login);


export default router;