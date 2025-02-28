import { NextFunction, Request, Response } from "express";
import AppError from "../Errors/appError";

const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "ADMIN") {
    return next();
  }

  return next(new AppError("Admins only.", 403));
};
export default adminMiddleware;
