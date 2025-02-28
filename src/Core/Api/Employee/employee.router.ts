import express, { Request, Response } from "express";
import employeeController from "./employee.controller";
import { auth } from "../../Middlewares/auth";
import adminMiddleware from "../../Middlewares/isAdmin";
export const employeeRouter = express.Router();
const controller = employeeController();

employeeRouter.post(
  "/create",
  auth,
  adminMiddleware,
  controller.employeeCreate
);

employeeRouter.put("/edit", auth, adminMiddleware, controller.employeeEdit);

employeeRouter.delete(
  "/delete",
  auth,
  adminMiddleware,
  controller.employeeDelete
);

employeeRouter.post("/list", controller.employeeListByCompany);
