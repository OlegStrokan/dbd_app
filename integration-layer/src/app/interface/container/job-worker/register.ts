import { ParcelEventWorker } from "../../job-workers/interval/parcel-event";

export const registerWorkers = async (nats) => {
  const parcelEventWorker = new ParcelEventWorker();
  return [
    {
      name: "parcel-event-worker",
      worker: await ParcelEventWorker.create(),
    },
  ];
};
