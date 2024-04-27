import { getConnectionManager, Connection } from "typeorm";
import { ParcelEvent } from "./entities/parcel-event";

export class DatabaseService {
  private connection: Promise<Connection>;

  constructor() {
    const connectionManager = getConnectionManager();
    if (connectionManager.has("default")) {
      this.connection = Promise.resolve(connectionManager.get("default"));
    } else {
      this.connection = connectionManager
        .create({
          name: "default",
          type: "postgres",
          host: "localhost",
          port: 8434,
          username: "stroka01",
          password: "user",
          database: "exchange_db",
          entities: [ParcelEvent],
          synchronize: false,
        })
        .connect();
    }
  }

  getConnection() {
    return this.connection;
  }
}
