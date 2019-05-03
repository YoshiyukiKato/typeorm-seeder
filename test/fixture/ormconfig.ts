import { ConnectionOptions } from "typeorm";
import path from "path";

export = <ConnectionOptions>{
  type: "sqlite",
  database: path.resolve(__dirname, "test.sqlite3"),
  synchronize: true,
  logging: false,
  entities: [path.resolve(__dirname, "./entities/*.ts")],
  migrations: [path.resolve(__dirname, "./migrations/*.ts")],
  subscribers: [path.resolve(__dirname, "./subscribers/*.ts")],
};
