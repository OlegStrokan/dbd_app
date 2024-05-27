import { AppDataSource } from "../../../../infrastructure/database.config";
import { ParcelEvent } from "../../../../infrastructure/entity/parcel-event/index";
import * as cron from "node-cron";
import { schemaResolvers } from "../../../resolvers/parcel-event";
import { NatsService } from "../../../../infrastructure/nats/index";
import { NatsConnection } from "nats";
import { IWorker } from "../../interface";
import { logger } from "../../../../core/services/logger/index";
import { MoreThan } from "typeorm";

export class ParcelEventWorker implements IWorker {
  private connection: NatsConnection | null = null;
  private lastSentAt: Date = new Date(0);

  constructor() {}

  static async create(nats: NatsService) {
    const worker = new ParcelEventWorker();
    await worker.init(nats.getConnection);
    return worker;
  }

  async init(connection: NatsConnection) {
    this.connection = connection;
  }

  async startCronJob() {
    try {
      cron.schedule("* * * * * *", async () => {
        try {
          const parcelEvents = await AppDataSource.manager.find(ParcelEvent, {
            where: { createdAt: MoreThan(this.lastSentAt.toISOString()) },
            order: { createdAt: "DESC" },
          });

          const encodeParcelEvent = (parcelEvent) => {
            const schemaResolver = schemaResolvers["v1"];
            if (!schemaResolver) return null;

            try {
              const { schema } = schemaResolver;
              return schema.toBuffer(parcelEvent);
            } catch (error) {
              return null;
            }
          };

          for (const parcelEvent of parcelEvents) {
            const encodedParcel = encodeParcelEvent(parcelEvent);

            if (encodedParcel) {
              logger.info(
                {
                  version: encodedParcel.version,
                },
                "Publishing parcel event:"
              );
              await this.connection.publish("parcel-event", encodedParcel);
              this.lastSentAt = new Date(parcelEvent.createdAt);
            } else {
              logger.error(
                {
                  parcelEvent,
                },
                "Unsupported schema version for parcel event:"
              );
            }
          }
        } catch (error) {
          logger.error({ error }, "Error processing parcel events");
        }
      });
    } catch (error) {
      logger.error({ error }, "Error starting cron job");
    }
  }
}
