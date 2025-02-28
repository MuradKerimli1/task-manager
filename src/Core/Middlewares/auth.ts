import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../Errors/appError";
import { User } from "../../Dal/Entity/User.entity";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next(new AppError("Invalid token", 401));
    }

    const decode = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN!);

    if (!decode) {
      return next(new AppError("Invalid token", 401));
    }

    const existUser = await User.findOne({ where: { id: +decode.sub! } });

    if (!existUser) {
      return next(new AppError("User not found on auth", 404));
    }

    req.user = existUser;

    next();
  } catch (error) {
    console.error("Error during authentication:", error);
    next(new AppError("Internal server error", 500));
  }
};
