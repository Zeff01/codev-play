import { Router } from "express";
import {register , login} from "../controllers/authController"
import { auth, loginValidation, registerValidation } from "../middleware/auth.middleware";


const router =  Router();

router.post("/register", registerValidation, register);
router.post("/login",loginValidation, login);


export default router;