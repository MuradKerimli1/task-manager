import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Company } from "./Company.entity";
import { Task } from "./Task.entity";
import { UserRole, UserStatus } from "../Enum/enum";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @ManyToOne(() => Company, (c) => c.users)
  @JoinColumn()
  company: Company;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.ACTIVE })
  status: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role: string;

  @OneToMany(() => Task, (task) => task.createdUser)
  tasksCreated: Task[];

  @ManyToMany(() => Task, (task) => task.assignedUsers, { onDelete: "CASCADE" })
  assignedTasks: Task[];
}
