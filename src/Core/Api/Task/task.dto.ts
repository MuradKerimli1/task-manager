import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsDate,
} from "class-validator";

import { Transform } from "class-transformer";
import { TaskPriority, TaskStatus } from "../../../Dal/Enum/enum";

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(["Low", "Normal", "High", "Immediate"])
  priority: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDate()
  deadline: Date;

  @IsNotEmpty()
  @IsDate()
  hour: Date;

  @IsOptional()
  @IsEnum(TaskStatus, {
    message:
      "Status must be one of: new, onHold, inProgress, developed, inTesting, tested, testFailed",
  })
  status?: string;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  deadline?: Date;

  @IsOptional()
  @IsString()
  hour?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: string;
}
