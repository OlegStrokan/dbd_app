import { DataSource } from "typeorm";
import { ParcelEvent } from "./entity/parcel-event";

export const ExchangeDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 8434,
  username: "stroka01",
  password: "user",
  database: "exchange_db",
  entities: [ParcelEvent],
});
