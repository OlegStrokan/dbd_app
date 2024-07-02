import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { IParcelDeliveryRepository } from "../../repositories/parcel-delivery";
import { IParcelImportService } from "./interfaces";
import { CreateParcelDeliveryInput } from "../../../interfaces/parcel-delivery/request-type";
import { ParcelDeliveryRepository } from "../../../infrastructure/repositories/parcel-delivery";
import { ImportManagerSaveError } from "./error";
import { JetStreamConsumerService } from "../nats/jetstream";
import { schemaResolvers } from "../../../interfaces/parcel-delivery/avro-schema";

// TODO - this functional working fine, but logs displayed not correct
@Injectable()
export class ParcelImportService
  implements IParcelImportService, OnModuleDestroy
{
  private readonly batchSize = 10;
  private readonly schemaVersion = "v1";

  constructor(
    @Inject(ParcelDeliveryRepository)
    private readonly parcelRepository: IParcelDeliveryRepository,
    @Inject(JetStreamConsumerService)
    private readonly jetStreamConsumerService: JetStreamConsumerService
  ) {
    this.init();
  }

  async init() {
    try {
      await this.subscribeToNatsMessages();
    } catch (error) {
      console.error("Error connecting to NATS:", error);
    }
  }

  async subscribeToNatsMessages() {
    try {
      await this.jetStreamConsumerService.connect(
        "parcel-event-consumer",
        "event",
        "parcel-event"
      );
    } catch (error) {
      console.error("Error subscribing to NATS messages:", error);
    }
  }

  decodeParcelEvent(buffer: Uint8Array) {
    const schemaResolver = schemaResolvers[this.schemaVersion];
    if (!schemaResolver) return null;

    try {
      const { schema } = schemaResolver;
      return schema.fromBuffer(buffer);
    } catch (error) {
      console.error("Error decoding buffer:", error);
      return null;
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async consumeNatsMessages() {
    try {
      const messages = await this.jetStreamConsumerService.getMessageBuffer();
      if (messages.length > 0) {
        const processedMessages = messages.map((msg) =>
          this.decodeParcelEvent(msg.data)
        );

        await this.saveDataToDatabase(processedMessages);
        this.jetStreamConsumerService.clearMessageBuffer();
      } else {
        console.log("No messages to process.");
      }
    } catch (error) {
      console.error("Error consuming messages:", error);
    }
  }

  async saveDataToDatabase(data: CreateParcelDeliveryInput[]) {
    try {
      await this.parcelRepository.upsertMany(data);
      console.log("Saved to database:");
    } catch (error) {
      console.error("Error saving data to database:", error);
      throw new ImportManagerSaveError("Error saving data to database", {
        message: error.message,
      });
    }
  }

  async onModuleDestroy() {
    try {
      await this.jetStreamConsumerService.onModuleDestroy();
      console.log("NATS connection closed on module destroy.");
    } catch (error) {
      console.error("Error disconnecting from NATS:", error);
    }
  }
}
