import { DataSource } from "typeorm";
import { ParcelEvent } from "./entity/parcel-event";

export const AppDataSource = new DataSource({
  name: "default",
  type: "postgres",
  host: "localhost",
  port: 8434,
  username: "stroka01",
  password: "user",
  database: "exchange_db",
  entities: [ParcelEvent],
  migrations: ["src/infrastructure/migrations/*.ts"],
});

export const initDb = async () => {
  await AppDataSource.initialize().catch((error) => console.log(error));
};
