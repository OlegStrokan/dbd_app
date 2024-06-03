import { getRandomParcelEventData } from "../../infrastructure/entity/parcel-event/mocks/getRandom";
import { AppDataSource } from "../../infrastructure/database.config";
import { createWorker } from "../create";
import { logger } from "../../services/logger/index";

export const createParcelEvent = async () => {
  const parcelEvent = getRandomParcelEventData();
  try {
    await AppDataSource.manager.save(parcelEvent);
  } catch (error) {
    logger.error({ error }, "Error saving parcel event");
  }
  logger.info({ parcelEventId: parcelEvent.createdAt }, "Parcel event created");
};

export const parcelEventWorker = {
  name: "parcelEventWorker",
  worker: createWorker({
    function: createParcelEvent,
    schedule: "* * * * * *",
  }),
};
