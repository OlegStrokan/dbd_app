import { AppDataSource } from "../../../infrastructure/exchange-database.config";
import { ILDataSource } from "../../../infrastructure/database.config";

export const createApiContainer = async () => {
  const dataSource = await AppDataSource.initialize();
  const iLDataSource = await ILDataSource.initialize();

  return {
    dataSource,
    iLDataSource,
  };
};
