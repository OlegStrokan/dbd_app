import { registerAs } from "@nestjs/config";
import { ParcelDeliveryEntity } from "../../parcel-delivery/infrastructure/entity/parcel-delivery";

export const DbConfig = registerAs("database", () => ({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 5433,
  username: process.env.DB_USER || "stroka01",
  password: process.env.DB_PASSWORD || "user",
  database: process.env.DB_NAME || "dev_db",
  entities: [ParcelDeliveryEntity],
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
  migrationsTableName: "migrations",
}));
