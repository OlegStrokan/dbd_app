import Fastify, { FastifyServerOptions } from "fastify";
import {
  parcelEventResolver,
  AvailableSchemas,
} from "@common/schema-registry/src/index";
import * as cron from "node-cron";

import { MoreThan } from "typeorm";
import NatsService from "./app/nats";
import { ParcelEvent } from "./app/infrastructure/entities/parcel-event";
import { DatabaseService } from "./app/infrastructure/database.config";
import { create } from "domain";

let lastProcessedAt = null;

export const startCronJob = async () => {
  const databaseService = new DatabaseService();
  const connection = await databaseService.getConnection();
  const parcelEventRepository = connection.getRepository(ParcelEvent);

  const natsService = new NatsService();
  await natsService.connect("nats://localhost:4222", "parcel-event");
  const nats = await natsService.getConnection;

  cron.schedule("*/2 * * * * *", async () => {
    let parcelEvents;
    console.log(lastProcessedAt, "lastProcessedAt");
    if (lastProcessedAt === null) {
      parcelEvents = await parcelEventRepository.find({
        order: { createdAt: "ASC" },
        take: 1,
      });
    } else {
      parcelEvents = await parcelEventRepository.find({
        where: { createdAt: MoreThan(lastProcessedAt) },
        order: { createdAt: "ASC" },
      });
    }
    for (const parcelEvent of parcelEvents) {
      console.log(parcelEvent, "parcelEvent");
      try {
        const { schema } = parcelEventResolver("v1");
        const encodedParcel = schema.toBuffer(parcelEvent);
        nats.publish("parcel-event", encodedParcel);
      } catch (error) {
        console.error("Error encoding parcel event:", error);
      }
      lastProcessedAt = parcelEvent.createdAt;
    }

    console.log("Parcel events published");
  });
};

export const createApp = async (serverOptions: FastifyServerOptions) => {
  const app = Fastify(serverOptions);
  console.log("start app");
  await startCronJob();
  return app;
};

createApp({ logger: true });
