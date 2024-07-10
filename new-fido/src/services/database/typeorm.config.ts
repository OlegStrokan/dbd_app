import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { ParcelDeliveryEntity } from "@app/parcel-delivery/infrastructure/entity/parcel-delivery";
import { ActionLogEntity } from "../action-logger/entity";

config();

const configService = new ConfigService();

export default new DataSource({
  type: "postgres",
  host: "10.32.0.18",
  port: configService.get("DB_PORT") || 5433,
  username: configService.get("DB_USER") || "stroka01",
  password: configService.get("DB_PASSWORD") || "user",
  database: configService.get("DB_NAME") || "dev_db",
  entities: [ParcelDeliveryEntity, ActionLogEntity],
  synchronize: configService.get("nodenv") === "development",
  logging: configService.get("nodenv") === "development",
  migrations: ["src/services/database/migrations/*{.ts,.js}"],
  migrationsTableName: "migrations",
});
