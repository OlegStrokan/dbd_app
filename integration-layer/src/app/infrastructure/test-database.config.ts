import { DataSource } from "typeorm";
import { Log } from "./entity/log";

export const ILDataTestSource = new DataSource({
  type: "postgres",
  host: "locahost",
  port: 8437,
  username: "stroka01",
  password: "test",
  database: "il_db_test",
  // migrations: ["src/app/infrastructure/migrations/*.ts"],
  entities: [Log],
});
