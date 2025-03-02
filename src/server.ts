import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "./Dal/Config/db";
import cors from "cors";
import { mainRouter } from "./Core/Router";
import cron from "node-cron";
import cronTask from "./Core/Lib/cron";

const server = express();
const port = process.env.PORT || 8080;

AppDataSource.initialize().then(async () => {
  console.log("db are connected");

  cron.schedule("*/10 * * * *", () => {
    cronTask();
  });

  server.use(
    cors({
      credentials: true,
      origin: "*",
    })
  );
  server.use(express.json());

  server.use(express.urlencoded({ extended: true }));

  // router
  server.use("/api/v1", mainRouter);

  // error middleware

  server.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err.message);
    res.status(err.status || 500).json({
      message: err.message || "Something went wrong. Please try again later.",
    });
  });

  server.listen(port, () => {
    console.log(`server running port ${port}`);
  });
});
