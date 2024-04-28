import Fastify, { FastifyServerOptions } from "fastify";
import { parcelEventResolver } from "@common/schema-registry/src/index";
import * as cron from "node-cron";
import NatsService from "./app/nats";
import { ParcelEvent } from "./app/infrastructure/entities/parcel-event";
import { AppDataSource } from "./app/infrastructure/database.config";

const schemaResolvers = {
  v1: parcelEventResolver("v1"),
  v2: parcelEventResolver("v2"),
};

export const startCronJob = async () => {
  const natsService = new NatsService();
  await natsService.connect("nats://localhost:4222", "parcel-event");
  const nats = await natsService.getConnection;

  cron.schedule("*/2 * * * * *", async () => {
    const parcelEvents = await AppDataSource.manager.find(ParcelEvent, {
      order: { createdAt: "DESC" },
    });

    const encodeParcelEvent = (parcelEvent, version) => {
      console.log(version, "version");
      const schemaResolver = schemaResolvers[version];
      if (!schemaResolver) return null;

      try {
        const { schema } = schemaResolver;
        return schema.toBuffer(parcelEvent);
      } catch (error) {
        return null;
      }
    };

    for (const parcelEvent of parcelEvents) {
      const encodedParcel = Object.keys(schemaResolvers)
        .map((version) => ({
          version,
          data: encodeParcelEvent(parcelEvent, version),
        }))
        .find((result) => result.data !== null);

      if (encodedParcel) {
        console.log("Publishing parcel event:", encodedParcel.version);
        nats.publish(
          `parcel-event.${encodedParcel.version}`,
          encodedParcel.data
        );
      } else {
        console.error(
          "Unsupported schema version for parcel event:",
          parcelEvent
        );
      }
    }
  });
};

export const createApp = async (serverOptions: FastifyServerOptions) => {
  const app = Fastify(serverOptions);
  await AppDataSource.initialize().catch((error) => console.log(error));
  console.log("start app");
  await startCronJob();
  return app;
};

createApp({ logger: true });
