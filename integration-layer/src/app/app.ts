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
import { createJobWorkerContainer } from "./interface/container/job-worker";

export class IntegrationLayerApp {
  private server: FastifyInstance<
    Http2SecureServer,
    Http2ServerRequest,
    Http2ServerResponse,
    FastifyBaseLogger,
    FastifyTypeProviderDefault
  > | null = null;
  private container = null;
  private jobWorkerContainer = null;
  constructor() {}

  start = async () => {
    try {
      this.container = await createApiContainer();
      this.server = Fastify(this.container);
      this.jobWorkerContainer = await createJobWorkerContainer();
      this.jobWorkerContainer.parcelEventWorker
        .startCronJob()
        .catch((error) => {
          console.error("Error starting cron job:", error);
        });
      console.log("start app");
    } catch (error) {
      console.error("Error starting app", error);
    }
  };

  stop() {
    try {
      this.server.close();
    } catch (error) {
      console.error("SERVER: Error stopping app", error);
    }
  }
}

// this.jobWorkerContainer = await createJobWorkerContainer();
// this.jobWorkerContainer.parcelEventWorker.start();
