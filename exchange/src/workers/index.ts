import { logger } from "../services/logger";
import { createWorker } from "./create";
import { createParcelEvent } from "./parcel-event/worker";

const workers = [
  createWorker({
    function: createParcelEvent,
    schedule: "* * * * * *",
  }),
];

export const registerWorkers = async () => {
  workers.map((worker) => {
    logger.info("Starting worker");
    worker.start();
  });
};
