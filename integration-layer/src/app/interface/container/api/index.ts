import { AppDataSource } from "../../../infrastructure/exchange-database.config";
import { ILDataSource } from "../../../infrastructure/database.config";
import { NatsService } from "../../../infrastructure/nats/index";

export const createApiContainer = async () => {
  const dataSource = await AppDataSource.initialize();
  const iLDataSource = await ILDataSource.initialize();
  const nats = new NatsService();

  return {
    dataSource,
    iLDataSource,
    nats,
  };
};
