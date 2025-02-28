import express from "express";
import { authRouter } from "../Api/Auth/auth.router";
import { companyRouter } from "../Api/Company/company.router";
import { employeeRouter } from "../Api/Employee/employee.router";
import { Taskrouter } from "../Api/Task/task.router";

export const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/company", companyRouter);
mainRouter.use("/employee", employeeRouter);
mainRouter.use("/task", Taskrouter);
