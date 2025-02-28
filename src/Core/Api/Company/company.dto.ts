import { IsString, IsNotEmpty, IsPhoneNumber } from "class-validator";

export class CompanyDto {
  @IsString()
  @IsNotEmpty({ message: "Company name cannot be empty" })
  name: string;

  @IsNotEmpty({ message: "Phone name cannot be empty" })
  @IsPhoneNumber("AZ")
  phone: string;

  @IsString()
  @IsNotEmpty({ message: "Address cannot be empty" })
  address: string;
}
