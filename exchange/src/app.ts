import Fastify, { FastifyServerOptions } from "fastify";
import { initDb } from "./infrastructure/database.config";
import { ParcelEventWorker } from "./workers/parcel-event/worker";

export const createApp = async (serverOptions: FastifyServerOptions) => {
  const app = Fastify(serverOptions);
  console.log("start app");
  await initDb();

  const parcelEventWorker = new ParcelEventWorker();
  await parcelEventWorker.start();
  return app;
};
