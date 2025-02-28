import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.entity";
import { Company } from "./Company.entity";
import { TaskPriority, TaskStatus } from "../Enum/enum";

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: "enum", enum: TaskPriority })
  priority: string;

  @Column()
  description: string;

  @Column()
  deadline: Date;

  @Column()
  hour: Date;

  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.NEW,
  })
  status: string;

  @ManyToOne(() => User, (u) => u.tasksCreated, { onDelete: "CASCADE" })
  @JoinColumn()
  createdUser: User;

  @ManyToMany(() => User, (user) => user.assignedTasks, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinTable()
  assignedUsers: User[];

  @ManyToOne(() => Company, { cascade: true })
  @JoinColumn()
  company: Company;
}
