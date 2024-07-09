import { ParcelEventWorker } from "../../job-workers/interval/parcel-event";

export const registerWorkers = async () => {
  return [
    {
      name: "parcel-event-worker",
      worker: await ParcelEventWorker.create(),
    },
  ];
};
