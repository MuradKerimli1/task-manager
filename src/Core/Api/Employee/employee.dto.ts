import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  ValidateIf,
  IsNotEmpty,
} from "class-validator";
import { UserStatus } from "../../../Dal/Enum/enum";



export class EmployeeDto {
  @ValidateIf((o) => o.name !== "")
  @IsString()
  @IsNotEmpty({ message: "Name should not be empty" })
  name?: string;

  @ValidateIf((o) => o.surname !== "")
  @IsString()
  @IsNotEmpty({ message: "Surname should not be empty" })
  surname?: string;

  @ValidateIf((o) => o.username !== "")
  @IsString()
  @IsNotEmpty({ message: "Username should not be empty" })
  username?: string;

  @ValidateIf((o) => o.email !== "")
  @IsEmail({}, { message: "Email must be a valid email" })
  email?: string;

  @ValidateIf((o) => o.password !== "")
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password?: string;

  @ValidateIf((o) => o.status !== "")
  @IsEnum(UserStatus, { message: "Status must be either ACTIVE or DEACTIVE" })
  status?: UserStatus;
}
