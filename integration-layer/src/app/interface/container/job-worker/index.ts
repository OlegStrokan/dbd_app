import { IWorker } from "../../job-workers/interface";
import { registerWorkers } from "./register";

interface IRegisteredWorker {
  worker: IWorker;
  name: string;
}

export interface IJobWorkerContainer {
  workers: IRegisteredWorker[];
}

export const createJobWorkerContainer =
  async (): Promise<IJobWorkerContainer> => {
    const workers = await registerWorkers();
    return {
      workers: workers,
    };
  };
