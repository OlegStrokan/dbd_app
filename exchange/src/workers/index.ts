import { logger } from "../services/logger";
import { parcelEventWorker } from "./parcel-event//worker";

const workers = [parcelEventWorker];

export const registerWorkers = async () => {
  workers.map(({ worker, name }) => {
    logger.info({ workerName: name }, "Starting worker");
    worker.start();
  });
};
