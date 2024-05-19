import { NatsService } from "../../../infrastructure/nats/index";
import { IWorker } from "../../job-workers/interface";
import { ParcelEventWorker } from "../../job-workers/interval/parcel-event";
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
    const nats = new NatsService();
    await nats.connect("nats://localhost:4222");

    const workers = await registerWorkers(nats);
    return {
      workers: workers,
    };
  };
