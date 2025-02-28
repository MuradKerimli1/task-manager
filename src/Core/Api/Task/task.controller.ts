import { NextFunction, Request, Response } from "express";
import { CreateTaskDto, UpdateTaskDto } from "./task.dto";
import { validate } from "class-validator";
import AppError from "../../Errors/appError";
import { formatErrors } from "../../Errors/dtoError";
import { User } from "../../../Dal/Entity/User.entity";
import { In } from "typeorm";
import { Task } from "../../../Dal/Entity/Task.entity";
import { TaskStatus } from "../../../Dal/Enum/enum";

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, priority, description, status, hour, deadline, assign } =
      req.body;

    const user = req.user;
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (!assign) {
      return next(new AppError("Assign cannot be empty", 400));
    }

    if (!deadline || !hour) {
      return next(new AppError("Deadline and hour cannot be empty", 400));
    }

    const deadlineDate = new Date(deadline);
    if (deadlineDate < new Date()) {
      return next(new AppError("Deadline cannot be in the past", 400));
    }

    const hourDate = new Date(hour);
    if (hourDate < new Date()) {
      return next(new AppError("Hour cannot be in the past", 400));
    }

    const task = new CreateTaskDto();
    task.title = title;
    task.priority = priority;
    task.description = description;
    task.status = status;
    task.hour = hourDate;
    task.deadline = deadlineDate;

    const handleError = await validate(task);

    if (handleError.length > 0) {
      return next(new AppError(formatErrors(handleError), 400));
    }

    const assignUsers = await User.find({ where: { id: In(assign) } });
    if (assignUsers.length !== assign.length) {
      return next(new AppError("Assign user not found", 404));
    }

    const newTask = new Task();
    newTask.title = title;
    newTask.priority = priority;
    newTask.description = description;
    newTask.status = status;
    newTask.hour = hourDate;
    newTask.deadline = deadlineDate;
    newTask.createdUser = user;
    newTask.assignedUsers = assignUsers;
    newTask.company = user.company;

    await newTask.save();

    res.status(201).json({ message: "Task created", task: newTask });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getTaskDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.body;

    if (!taskId) {
      return next(new AppError("Task id cannot be empty", 400));
    }

    const task = await Task.findOne({ where: { id: +taskId } });
    if (!task) {
      return next(new AppError("Task not found", 404));
    }

    res.status(200).json({ task });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const tasks = await Task.find({
      where: { company: user.company },
      relations: ["createdUser", "assignedUsers"],
    });

    if (tasks.length === 0) {
      return next(new AppError("No tasks found", 404));
    }

    res.status(200).json({ tasks });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId } = req.body;
    if (!taskId) {
      return next(new AppError("Task id cannot be empty", 400));
    }
    const task = await Task.findOne({ where: { id: +taskId } });
    if (!task) {
      return next(new AppError("Task not found", 404));
    }
    await task.remove();
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      taskId,
      title,
      priority,
      description,
      status,
      hour,
      deadline,
      assign,
    } = req.body;

    if (!taskId) {
      return next(new AppError("Task id cannot be empty", 400));
    }

    const updateTaskDto = new UpdateTaskDto();
    updateTaskDto.title = title;
    updateTaskDto.priority = priority;
    updateTaskDto.description = description;
    updateTaskDto.status = status;

    const errors = await validate(updateTaskDto);
    if (errors.length > 0) {
      return next(new AppError(formatErrors(errors), 400));
    }

    const task = await Task.findOne({ where: { id: +taskId } });
    if (!task) {
      return next(new AppError("Task not found", 404));
    }

    if (assign) {
      const assignUsers = await User.find({ where: { id: In(assign) } });
      if (assignUsers.length !== assign.length) {
        return next(new AppError("Assign user not found", 404));
      }
      task.assignedUsers = assignUsers;
    }

    if (hour) {
      const hourDate = new Date(hour);
      if (hourDate < new Date()) {
        return next(new AppError("Hour cannot be in the past", 400));
      }
      task.hour = hourDate;
    }

    if (deadline) {
      const deadlineDate = new Date(deadline);
      if (deadlineDate < new Date()) {
        return next(new AppError("Deadline cannot be in the past", 400));
      }
      task.deadline = deadlineDate;
    }

    task.title = title || task.title;
    task.priority = priority || task.priority;
    task.description = description || task.description;
    task.status = status || task.status;

    await task.save();

    res.status(200).json({ message: "Task updated", task });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const allOpenTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allOpenTasks = await Task.find({
      where: {
        status: In([
          TaskStatus.DEVELOPED,
          TaskStatus.IN_PROGRESS,
          TaskStatus.NEW,
          TaskStatus.IN_TESTING,
          TaskStatus.ON_HOLD,
        ]),
      },
    });
    if (allOpenTasks.length === 0) {
      return next(new AppError("No open tasks found", 404));
    }
    res.status(200).json({ allOpenTasks });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const allclosedTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allclosedTasks = await Task.find({
      where: {
        status: In([TaskStatus.TESTED, TaskStatus.TEST_FAILED]),
      },
    });
    if (allclosedTasks.length === 0) {
      return next(new AppError("No closed tasks found", 404));
    }
    res.status(200).json({ allclosedTasks });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const taskController = () => {
  return {
    createTask,
    getTaskDetails,
    getAllTasks,
    deleteTask,
    updateTask,
    allOpenTasks,
    allclosedTasks,
  };
};

export default taskController;
