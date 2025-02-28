import { NextFunction, Request, Response } from "express";
import { UserDto } from "../Auth/auth.dto";
import { validate } from "class-validator";
import AppError from "../../Errors/appError";
import { formatErrors } from "../../Errors/dtoError";
import { User } from "../../../Dal/Entity/User.entity";
import bcrypt from "bcrypt";
import { Company } from "../../../Dal/Entity/Company.entity";
import { EmployeeDto } from "./employee.dto";

const employeeCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, username, email, surname, name, status, companyId } =
      req.body;
    if (!companyId) {
      return next(new AppError("Company ID cannot be empty", 400));
    }

    // validate user
    const newUser = new UserDto();
    newUser.name = name;
    newUser.surname = surname;
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;
    newUser.status = status;

    const handleError = await validate(newUser);

    if (handleError.length > 0) {
      return next(new AppError(formatErrors(handleError), 400));
    }
    // employee exist and exist company
    const existCompany = await Company.findOne({ where: { id: +companyId } });
    if (!existCompany) {
      return next(new AppError("Company not found", 404));
    }
    const existEmployee = await User.findOne({ where: { email: email } });
    if (existEmployee) {
      return next(new AppError("Employee email already exists", 409));
    }

    // hash password
    const hashedPass = await bcrypt.hash(password, 10);

    // save employee
    const employee = new User();
    employee.name = name;
    employee.surname = surname;
    employee.username = username;
    employee.email = email;
    employee.password = hashedPass;
    employee.status = status || "ACTIVE";
    employee.role = "USER";
    employee.company = existCompany;
    await employee.save();

    res
      .status(201)
      .json({ message: "Employee created successfully", employee });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const employeeEdit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      password,
      username,
      email,
      surname,
      name,
      status,
      companyId,
      employeeId,
    } = req.body;

    if (!employeeId) {
      return next(new AppError("Employee ID cannot be empty", 400));
    }

    const existEmployee = await User.findOne({ where: { id: +employeeId } });
    if (!existEmployee) {
      return next(new AppError("Employee not found", 404));
    }

    const employee = new EmployeeDto();
    employee.name = name;
    employee.surname = surname;
    employee.username = username;
    employee.email = email;
    employee.password = password;
    employee.status = status;

    const handleError = await validate(employee);

    if (handleError.length > 0) {
      return next(new AppError(formatErrors(handleError), 400));
    }

    if (companyId && companyId !== existEmployee.company?.id) {
      const existCompany = await Company.findOne({ where: { id: +companyId } });
      if (!existCompany) {
        return next(new AppError("Company not found", 404));
      }
      existEmployee.company = existCompany;
    }

    if (password && password !== existEmployee.password) {
      const hashedPass = await bcrypt.hash(password, 10);
      existEmployee.password = hashedPass;
    }

    if (email && email !== existEmployee.email) {
      const emailExists = await User.findOne({ where: { email: email } });
      if (emailExists) {
        return next(new AppError("Employee email already exists", 409));
      }
      existEmployee.email = email;
    }

    existEmployee.name = name || existEmployee.name;
    existEmployee.surname = surname || existEmployee.surname;
    existEmployee.username = username || existEmployee.username;
    existEmployee.status = status || existEmployee.status;

    await existEmployee.save();

    res.status(200).json({
      message: "Employee updated successfully",
      success: true,
      employee: existEmployee,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const employeeDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) {
      return next(new AppError("employeeId cannot be empty", 400));
    }

    const existEmployee = await User.findOne({ where: { id: +employeeId } });
    if (!existEmployee) {
      return next(new AppError("existEmployee not found", 404));
    }

    await User.delete({ id: +employeeId });

    res
      .status(200)
      .json({ message: "Employee deleted successfully", success: true });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const employeeListByCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId } = req.body;
    if (!companyId) {
      return next(new AppError("companyId cannot be empty", 400));
    }

    const existCompany = await Company.findOne({ where: { id: +companyId } });
    if (!existCompany) {
      return next(new AppError("Company not found", 404));
    }

    const employeeList = await User.find({
      where: { company: existCompany },
    });
    if (!employeeList) {
      return next(new AppError("Employee not found", 404));
    }

    res.status(200).json({ message: "Employee list", employeeList });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const employeeController = () => {
  return {
    employeeCreate,
    employeeEdit,
    employeeDelete,
    employeeListByCompany,
  };
};

export default employeeController;
