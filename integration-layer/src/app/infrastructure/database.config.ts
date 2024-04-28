import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  name: "default",
  type: "postgres",
  host: "localhost",
  port: 8434,
  username: "stroka01",
  password: "user",
  database: "exchange_db",
  entities: ["src/infrastructure/entity/**/index.ts"],
});
