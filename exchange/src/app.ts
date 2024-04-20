import Fastify, { FastifyServerOptions } from "fastify";
import { JSONCodec } from "nats";
import NatsService from "./nats";
import { DatabaseService } from "./infrastructure/database.config";
import { ParcelRepository } from "./infrastructure/repositories/parcel-event";
import { ParcelService } from "./core/parcel-event";

export const createIntegrationApiInterface = async (
  serverOptions: FastifyServerOptions
) => {
  const app = Fastify(serverOptions);

  const natsService = new NatsService();
  await natsService.connect("nats://localhost:4222", "parcel-event");

  const nats = await natsService.getConnection;
  const dbService = new DatabaseService();

  setInterval(async () => {
    const parcel = {
      id: Math.floor(Math.random() * 1000000),
      parcelNumber: Math.floor(Math.random() * 1000000),
    };

    const databaseService = new DatabaseService();
    const connection = await databaseService.getConnection();
    const parcelService = new ParcelService();
    const createdParcel = await parcelService.create(parcel);
    nats.publish("parcel-event", JSONCodec().encode(createdParcel));
    console.log("Parcel sent to NATS", parcel);
  }, 5000);

  return app;
};
