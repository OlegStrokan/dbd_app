import { DataSource } from "typeorm";
import { ParcelEvent } from "./entity/parcel-event";
import { logger } from "../services/logger";

console.log(process.env.DB_NAME);
export const AppDataSource = new DataSource({
  name: process.env.DB_NAME || "default",
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 8434,
  username: process.env.DB_USERNAME || "stroka01",
  password: process.env.DB_PASSWORD || "user",
  database: process.env.DB_DATABASE || "exchange_db",
  entities: [ParcelEvent],
  migrations: ["src/infrastructure/migrations/*.ts"],
});

export const initDb = async () => {
  return await AppDataSource.initialize().catch((error) =>
    logger.error({ error }, "Error initializing database")
  );
};
