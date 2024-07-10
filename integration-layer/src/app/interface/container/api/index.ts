import { ExchangeDataSource } from "../../../infrastructure/exchange-database.config";
import { ILDataSource } from "../../../infrastructure/database.config";
import { IApiContainer } from "../test";

export const createApiContainer = async (): Promise<IApiContainer> => {
  const exchangeDataSource = await ExchangeDataSource.initialize();
  const iLDataSource = await ILDataSource.initialize();

  return {
    exchangeDataSource,
    iLDataSource,
  };
};
