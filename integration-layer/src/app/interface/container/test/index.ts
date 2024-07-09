import { ILDataTestSource } from "@root/src/app/infrastructure/test-database.config";
import {
  createJobWorkerContainer,
  IJobWorkerContainer,
} from "../job-worker/index";
import { AppDataSource } from "@root/src/app/infrastructure/exchange-database.config";

export const createTestContainer = async () => {
  const dataSource = await AppDataSource.initialize();
  const iLDataSource = await ILDataTestSource.initialize();

  return {
    dataSource,
    iLDataSource,
  };
};

export async function createTestApiContainer() {
  const apiContainer = await createTestContainer();
  const jobWorkerContainer: IJobWorkerContainer =
    await createJobWorkerContainer();

  return { apiContainer, jobWorkerContainer };
}
