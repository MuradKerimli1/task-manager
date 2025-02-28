import express from "express";
import companyController from "./company.controller";
import { auth } from "../../Middlewares/auth";
import adminMiddleware from "../../Middlewares/isAdmin";

export const companyRouter = express.Router();
const controller = companyController();

companyRouter.post("/create", auth, adminMiddleware, controller.companyCreate);
