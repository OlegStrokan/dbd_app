import Fastify, { FastifyServerOptions } from "fastify";
import { initDb } from "./infrastructure/database.config";
import { registerWorkers } from "./workers";
import { logger } from "./services/logger";

export const createApp = async (serverOptions: FastifyServerOptions) => {
  serverOptions.logger = {
    level: "info",
  };
  const app = Fastify(serverOptions);

  logger.info("start app");
  await initDb();

  await registerWorkers();
  return app;
};
