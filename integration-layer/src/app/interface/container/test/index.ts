import { ILDataTestSource } from "../../../infrastructure/test-database.config";
import { ExchangeDataSource } from "../../../infrastructure/exchange-database.config";
import { DataSource } from "typeorm";
import { ParcelEventWorker } from "../../job-workers/interval/parcel-event";

export interface IApiContainer {
  exchangeDataSource: DataSource;
  iLDataSource: DataSource;
}

export interface IAppContainer {
  apiContainer: IApiContainer;
  parcelEventWorker: ParcelEventWorker;
}

export const createTestApiContainer = async (): Promise<IApiContainer> => {
  const exchangeDataSource = await ExchangeDataSource.initialize();
  const iLDataSource = await ILDataTestSource.initialize();

  return {
    exchangeDataSource,
    iLDataSource,
  };
};

export const createTestAppContainer = async (): Promise<IAppContainer> => {
  const apiContainer = await createTestApiContainer();
  const parcelEventWorker = new ParcelEventWorker(
    apiContainer.iLDataSource,
    apiContainer.exchangeDataSource
  );

  return { apiContainer, parcelEventWorker };
};
