import { DataSource } from "typeorm";
import { ParcelEventScheduleJob } from "../../job-workers/interval/parcel-event";

export enum WORKER {
  PARCEL_EVENT = "parcel-event-worker",
}
export const registerWorkers = async (
  ilDb: DataSource,
  exchangeDb: DataSource
) => {
  return [
    {
      name: WORKER.PARCEL_EVENT,
      worker: await ParcelEventScheduleJob.create(ilDb, exchangeDb),
    },
  ];
};
