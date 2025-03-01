import { NextFunction, Request, Response } from "express";
import { CompanyDto } from "./company.dto";
import { validate } from "class-validator";
import AppError from "../../Errors/appError";
import { formatErrors } from "../../Errors/dtoError";
import { Company } from "../../../Dal/Entity/Company.entity";
import { User } from "../../../Dal/Entity/User.entity";

const companyCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, phone, address, id } = req.body;
    if (!id) {
      return next(new AppError("Creator ID cannot be empty", 400));
    }

    const validateCompany = new CompanyDto();
    validateCompany.name = name;
    validateCompany.phone = phone;
    validateCompany.address = address;

    const handleError = await validate(validateCompany);

    if (handleError.length > 0) {
      return next(new AppError(formatErrors(handleError), 400));
    }

    // exist company and exist User

    const existUser = await User.findOne({
      where: { id: id },
      relations: {
        company: true,
      },
    });
    if (!existUser) {
      return next(new AppError("User not found", 404));
    }

    const existCompany = await Company.findOne({ where: { name: name } });
    if (existCompany) {
      return next(new AppError("Company name already exists", 409));
    }

    const userCompany = await Company.findOne({
      where: { creator: existUser },
    });
    if (userCompany) {
      return next(new AppError("User already has a company", 409));
    }

    // save company
    const company = new Company();
    company.name = name;
    company.phone = phone;
    company.address = address;
    company.creator = existUser;
    await company.save();

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const companyController = () => {
  return { companyCreate };
};

export default companyController;
