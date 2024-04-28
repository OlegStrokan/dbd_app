import Fastify, { FastifyServerOptions } from "fastify";
import { Worker, spawn } from "threads";

export const createApp = async (serverOptions: FastifyServerOptions) => {
  const app = Fastify(serverOptions);
  console.log("start app");

  const parcelEventWorker = await spawn(
    new Worker("./workers/parcel-event/worker.ts")
  );
  await parcelEventWorker();

  return app;
};
