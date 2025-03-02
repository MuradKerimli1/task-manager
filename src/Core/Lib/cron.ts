import { LessThan, Not } from "typeorm";
import { Task } from "../../Dal/Entity/Task.entity";
import { TaskStatus } from "../../Dal/Enum/enum";

const cronTask = async () => {
  try {
    const tasks = await Task.find({
      where: {
        deadline: LessThan(new Date()),
        status: Not(TaskStatus.TESTED),
      },
    });

    if (tasks.length > 0) {
      for (const t of tasks) {
        try {
          t.status = TaskStatus.TEST_FAILED;
          await t.save();
        } catch (err) {
          console.error("Error saving task");
        }
      }
      console.log("task status changed");
    }
  } catch (err) {
    console.error("Error fetching tasks:");
  }
};

export default cronTask;
