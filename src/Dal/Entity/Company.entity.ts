import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
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

  @OneToOne(() => User, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn()
  creator: User;

  @OneToMany(() => User, (user) => user.company, { cascade: true })
  users: User[];
}
