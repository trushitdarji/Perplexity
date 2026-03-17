import { Router } from "express";
import {register,verifyEmail,login,getMe,resendEmail} from "../controllers/auth.controller.js";
import {validateRegister,validateLogin} from "../validators/auth.validator.js";
import { authuser } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", validateRegister, register);

authRouter.post("/login", validateLogin, login);

authRouter.get("/get-me", authuser, getMe);

authRouter.get("/verify-email", verifyEmail);

authRouter.post("/resend-email", authuser, resendEmail);

export default authRouter;
