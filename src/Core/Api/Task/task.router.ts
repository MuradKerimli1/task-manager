import express from "express";
import taskController from "./task.controller";
import { auth } from "../../Middlewares/auth";
export const Taskrouter = express.Router();
const controller = taskController();

Taskrouter.post("/create", auth, controller.createTask);
Taskrouter.post("/getDetails", auth, controller.getTaskDetails);
Taskrouter.get("/getAll", auth, controller.getAllTasks);
Taskrouter.delete("/deleteTask", auth, controller.deleteTask);
Taskrouter.put("/updateTask", auth, controller.updateTask);
Taskrouter.get("/allopenTask", auth, controller.allOpenTasks);
Taskrouter.get("/allclosedTask", auth, controller.allclosedTasks);
Taskrouter.post("/filter", auth, controller.filterTask);
