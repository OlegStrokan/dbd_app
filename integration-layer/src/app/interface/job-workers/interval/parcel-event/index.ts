import { AppDataSource } from "../../../../infrastructure/database.config";
import { ParcelEvent } from "../../../../infrastructure/entity/parcel-event/index";
import * as cron from "node-cron";
import { schemaResolvers } from "../../../resolvers/parcel-event";
import { NatsService } from "../../../../infrastructure/nats/index";
import { NatsConnection } from "nats";

export class ParcelEventWorker {
  private connection: NatsConnection | null = null;

  constructor() {}

  static async create(nats: NatsService) {
    const worker = new ParcelEventWorker();
    await worker.init(nats.getConnection);
    return worker;
  }

  private async init(connection: NatsConnection) {
    this.connection = connection;
  }

  async startCronJob() {
    try {
      cron.schedule("* * * * * *", async () => {
        try {
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
              console.log(
                "Publishing parcel event:",
                encodedParcel.version,
                encodedParcel.data
              );
              await this.connection.publish("parcel-event", encodedParcel.data);
            } else {
              console.error(
                "Unsupported schema version for parcel event:",
                parcelEvent
              );
            }
          }
        } catch (error) {
          console.error("Error processing parcel events", error);
        }
      });
    } catch (error) {
      console.error("Error starting cron job", error);
    }
  }
}
