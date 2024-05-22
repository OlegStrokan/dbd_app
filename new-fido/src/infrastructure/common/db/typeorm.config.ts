import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { ParcelDeliveryEntity } from "../../entities/parcel-delivery";

config();

const configService = new ConfigService();

export default new DataSource({
  type: "postgres",
  host: "localhost",
  port: configService.get("DB_PORT") || 5433,
  username: configService.get("DB_USER") || "stroka01",
  password: configService.get("DB_PASSWORD") || "user",
  database: configService.get("DB_NAME") || "dev_db",
  entities: ["src/infrastructure/entities/*/*{.ts,.js}"],
  synchronize: configService.get("nodenv") === "development",
  logging: configService.get("nodenv") === "development",
  migrations: ["src/infrastructure/common/db/migrations/*{.ts,.js}"],
  migrationsTableName: "migrations",
});
