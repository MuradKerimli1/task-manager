import express from "express";
import authController from "./auth.controller";
import { auth } from "../../Middlewares/auth";
export const authRouter = express.Router();
const controller = authController();

authRouter.post("/register", controller.registerUser);
authRouter.post("/login", controller.loginUser);
authRouter.get("/me", auth, controller.userDetails);
