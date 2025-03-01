import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.entity";

@Entity()
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @OneToOne(() => User, (user) => user.createdCompany)
  creator: User;

  @OneToMany(() => User, (user) => user.company, { cascade: true })
  users: User[];
}
