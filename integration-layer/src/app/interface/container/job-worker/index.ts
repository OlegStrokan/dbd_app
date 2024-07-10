import { DataSource } from "typeorm";
import { IWorker } from "../../job-workers/interface";
import { registerWorkers } from "./register";

interface IRegisteredWorker {
  worker: IWorker;
  name: string;
}

export interface IJobWorkerContainer {
  workers: IRegisteredWorker[];
}

export const createJobWorkerContainer = async (
  ilDb: DataSource,
  exhcnageDb: DataSource
): Promise<IJobWorkerContainer> => {
  const workers = await registerWorkers(ilDb, exhcnageDb);
  return {
    workers: workers,
  };
};
