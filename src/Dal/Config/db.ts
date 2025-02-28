import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "taskmanager",
  synchronize: true,
  logging: false,
  entities: [__dirname + "/../Entity/*.{ts,js}"],
  subscribers: [],
  migrations: [],
});
