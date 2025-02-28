import { NextFunction, Request, Response } from "express";
import AppError from "../../Errors/appError";
import { User } from "../../../Dal/Entity/User.entity";
import { validate } from "class-validator";
import { formatErrors } from "../../Errors/dtoError";
import bcrypt from "bcrypt";
import { createTokenanSet } from "../../Lib/accessToken";
import { UserDto } from "./auth.dto";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, username, email, surname, name } = req.body;

    // validate user
    const newUser = new UserDto();
    newUser.name = name;
    newUser.surname = surname;
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;

    const handleError = await validate(newUser);

    if (handleError.length > 0) {
      return next(new AppError(formatErrors(handleError), 400));
    }

    // Check if user exists

    const existUser = await User.findOne({ where: { email: email } });

    if (existUser) {
      return next(new AppError("email  already exists", 409));
    }

    // Hash password
    const hashedPass = await bcrypt.hash(password, 10);

    // Save user
    const user = new User();
    user.name = name;
    user.surname = surname;
    user.username = username;
    user.email = email;
    user.role = "ADMIN";
    user.password = hashedPass;
    await user.save();

    // Response
    res.status(201).json({ message: "User successfully added", success: true });
  } catch (error) {
    console.error("Error during registration:", error);
    next(new AppError("Server internal error", 500));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Email və şifrə tələb olunur!", 400));
    }

    // check email
    const existUser = await User.findOne({ where: { email: email } });
    if (!existUser) {
      return next(new AppError("Email tapılmadı!", 404));
    }

    // check password
    const validatePass = await bcrypt.compare(password, existUser.password);
    if (!validatePass) {
      return next(new AppError("Yanlış şifrə!", 400));
    }

    // token
    const access = createTokenanSet(existUser.id);

    res.status(200).json({
      message: "Giriş uğurla tamamlandı!",
      success: true,
      data: {
        accessToken: access,
        user: existUser,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    next(new AppError("server internal error", 500));
  }
};

const userDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const existUser = await User.findOne({ where: { id: user.id } });
    if (!existUser) {
      return next(new AppError("User not found", 404));
    }
    res.status(200).json({
      success: true,
      data: existUser,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    next(new AppError("server internal error", 500));
  }
};

const authController = () => {
  return { registerUser, loginUser, userDetails };
};

export default authController;
