import { logger } from "../services/logger";
import { createWorker } from "./create";
import { createParcelEvent, parcelEventWorker } from "./parcel-event/worker";

const workers = [parcelEventWorker];

export const registerWorkers = async () => {
  workers.map(({ worker, name }) => {
    logger.info({ workerName: name }, "Starting worker");
    worker.start();
  });
};
