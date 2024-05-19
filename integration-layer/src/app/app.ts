import Fastify, {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyTypeProviderDefault,
} from "fastify";
import {
  Http2SecureServer,
  Http2ServerRequest,
  Http2ServerResponse,
} from "http2";
import { createApiContainer } from "./interface/container/api";
import {
  IJobWorkerContainer,
  createJobWorkerContainer,
} from "./interface/container/job-worker";
import { logger } from "./core/services/logger";

export class IntegrationLayerApp {
  private server: FastifyInstance<
    Http2SecureServer,
    Http2ServerRequest,
    Http2ServerResponse,
    FastifyBaseLogger,
    FastifyTypeProviderDefault
  > | null = null;
  private container = null;
  private jobWorkerContainer: IJobWorkerContainer = null;
  constructor() {}

  start = async () => {
    try {
      this.container = await createApiContainer();
      this.server = Fastify(this.container);
      this.jobWorkerContainer = await createJobWorkerContainer();
      this.jobWorkerContainer.workers.forEach(({ worker, name }) => {
        worker.startCronJob().catch((error) => {
          logger.error({ error }, "Error starting cron job:");
        });
      });
      logger.info("start app");
    } catch (error) {
      console.log(error);
      logger.error({ error }, "Error starting app");
    }
  };

  stop() {
    try {
      this.server.close();
      logger.info("stop app");
    } catch (error) {
      logger.error({ error }, "SERVER: Error stopping app");
    }
  }
}
