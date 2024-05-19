import { FastifyServerOptions } from "fastify";
import { IntegrationLayerApp } from "./app/app";
import { logger } from "./app/core/services/logger";

export const startApp = async (serverOptions: FastifyServerOptions) => {
  try {
    const app = new IntegrationLayerApp();
    serverOptions.logger = {
      level: "info",
    };
    return app.start();
  } catch (error) {
    console.log(error);
    logger.error({ error: error }, "Error starting apping");
  }
};

startApp({ logger: true }).catch((error) => console.error(error));
