import { NatsService } from "../../../infrastructure/nats/index";
import { ParcelEventWorker } from "../../job-workers/interval/parcel-event";

export const createJobWorkerContainer = async (): Promise<{
  parcelEventWorker: ParcelEventWorker;
}> => {
  const nats = new NatsService();
  await nats.connect("nats://localhost:4222");
  const parcelEventWorker = await ParcelEventWorker.create(nats);

  return {
    parcelEventWorker,
  };
};
