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
  try {
    const exchangeDataSource = await ExchangeDataSource.initialize();

    const iLDataSource = await ILDataTestSource.initialize();

    return {
      exchangeDataSource,
      iLDataSource,
    };
  } catch (error) {
    console.error("Error during createTestApiContainer:", error);
    throw error;
  }
};

export const createTestAppContainer = async (): Promise<IAppContainer> => {
  try {
    const apiContainer = await createTestApiContainer();

    const parcelEventWorker = new ParcelEventWorker(
      apiContainer.iLDataSource,
      apiContainer.exchangeDataSource
    );

    return { apiContainer, parcelEventWorker };
  } catch (error) {
    console.error("Error during createTestAppContainer:", error);
    throw error;
  }
};
