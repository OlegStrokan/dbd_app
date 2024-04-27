import Fastify, { FastifyServerOptions } from "fastify";
import { DatabaseService } from "./infrastructure/database.config";
import { ParcelEvent } from "./infrastructure/entity/parcel-event";
import * as cron from "node-cron";

export const startCronJob = async () => {
  const databaseService = new DatabaseService();
  const connection = await databaseService.getConnection();
  const parcelEventRepository = connection.getRepository(ParcelEvent);

  cron.schedule("* * * * * *", async () => {
    const parcelEvent = new ParcelEvent();
    parcelEvent.id = Math.floor(Math.random() * 1000000).toString();
    parcelEvent.parcelNumber = Math.floor(Math.random() * 1000000).toString();
    parcelEvent.createdAt = new Date().toISOString();
    parcelEvent.updatedAt = new Date().toISOString();
    await parcelEventRepository.save(parcelEvent);
    console.log("Parcel event created", parcelEvent);
  });
};

export const createApp = async (serverOptions: FastifyServerOptions) => {
  const app = Fastify(serverOptions);
  console.log("start app");
  await startCronJob();
  return app;
};
