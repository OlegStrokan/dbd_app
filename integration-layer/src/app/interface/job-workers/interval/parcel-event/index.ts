import { ParcelEvent } from "../../../../infrastructure/entity/parcel-event/index";
import * as cron from "node-cron";
import { schemaResolvers } from "../../../resolvers/parcel-event";
import { IScheduleJob } from "../../interface";
import { logger } from "../../../../core/services/logger/index";
import { DataSource, MoreThan } from "typeorm";
import { Log } from "../../../../infrastructure/entity/log/index";
import { getJetStreamConnection } from "../../../../infrastructure/jetstream/jetstream";
import { OperationFunction, retry } from "../../../../utils/retry/index";

const PARCEL_EVENT_CHUNK_SIZE = 1000;
export class ParcelEventScheduleJob implements IScheduleJob {
  private lastSentAt: Date = new Date(0);
  private subjectName: string = "parcel-event";
  private schemaVersion: string = "v1";

  constructor(
    private readonly ilRepository: DataSource,
    private readonly exchangeRepository: DataSource
  ) {}

  static async create(ilDB: DataSource, exchangeDB: DataSource) {
    const worker = new ParcelEventScheduleJob(ilDB, exchangeDB);
    await worker.loadLastSentAt();
    return worker;
  }

  get getLastSentAt() {
    return this.lastSentAt;
  }

  async loadLastSentAt() {
    try {
      const log = await this.ilRepository.manager.find(Log, {
        order: {
          lastConsumedAt: "DESC",
        },
        take: 1,
      });
      if (log) {
        this.lastSentAt = new Date(log[0]?.lastConsumedAt);
      }
    } catch (error) {
      logger.error({ message: error.message }, "Error loading last sent at");
    }
  }

  async saveLastSentAt(lastSentAt: Date) {
    try {
      const log = await this.ilRepository.manager.find(Log, {
        order: {
          lastConsumedAt: "DESC",
        },
        take: 1,
      });
      console.log(log);

      if (log.length > 0) {
        log[0].lastConsumedAt = lastSentAt.toISOString();
        await this.ilRepository.manager.update(Log, log[0]?.id, log[0]);
      } else {
        const newLog = new Log({
          lastConsumedAt: lastSentAt.toISOString(),
        });
        await this.ilRepository.manager.save(newLog);
      }

      if (lastSentAt > this.lastSentAt) {
        this.lastSentAt = lastSentAt;
      }
    } catch (error) {
      logger.error({ error }, "Error saving last sent at");
    }
  }

  async startCronJob() {
    try {
      cron.schedule("* * * * * *", async () => {
        for await (const parcelEventChunk of this.getDataAfter(
          this.lastSentAt.toISOString()
        )) {
          for (const parcelEvent of parcelEventChunk) {
            const updatedAtDate = new Date(parcelEvent.updatedAt);
            if (updatedAtDate > this.lastSentAt) {
              const encodedParcel = this.encodeParcelEvent(parcelEvent);

              if (encodedParcel) {
                await this.publishParcelEvent(
                  encodedParcel,
                  updatedAtDate,
                  parcelEvent.id
                );
              } else {
                logger.error(
                  { parcelEvent },
                  "Unsupported schema version for parcel event"
                );
              }
            }
          }
        }
      });
    } catch (error) {
      logger.error({ error }, "Error starting cron job");
    }
  }

  private async publishParcelEvent(
    encodedParcel: any,
    updatedAtDate: Date,
    parcelEventId: string
  ) {
    const operation: OperationFunction<void> = async () => {
      logger.info("Start publishing");
      const nats = await getJetStreamConnection(this.subjectName);
      await nats.publish(this.subjectName, encodedParcel);
      logger.info(
        { version: this.schemaVersion, id: parcelEventId },
        "Publishing parcel event:"
      );
      this.lastSentAt = updatedAtDate;
      await this.saveLastSentAt(this.lastSentAt);
    };

    try {
      await retry(operation, 3, 100);
    } catch (error) {
      logger.error(
        { error, id: parcelEventId },
        "Error publishing parcel event after retries"
      );
    }
  }

  private encodeParcelEvent = (parcelEvent: ParcelEvent): Buffer => {
    const schemaResolver = schemaResolvers[this.schemaVersion];
    if (!schemaResolver) return null;

    try {
      const { schema } = schemaResolver;
      return schema.toBuffer(parcelEvent);
    } catch (error) {
      return null;
    }
  };

  private async *getDataAfter(after: string) {
    while (true) {
      const result = await this.exchangeRepository.manager.find(ParcelEvent, {
        where: {
          updatedAt: MoreThan(after),
        },
        skip: 0,
        take: PARCEL_EVENT_CHUNK_SIZE,
        order: { createdAt: "ASC" },
      });

      if (result.length === 0) break;

      yield result;
    }
  }
}
