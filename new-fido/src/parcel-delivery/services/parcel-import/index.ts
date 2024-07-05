// parcel-import.service.ts
import { Injectable, Inject, OnModuleDestroy } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { IParcelImportService } from "./interfaces";
import { ParcelDeliveryRepository } from "@app/parcel-delivery/infrastructure/repository/parcel-delivery";
import { IParcelDeliveryRepository } from "@app/parcel-delivery/repository";
import { JetStreamConsumerService } from "@app/services/nats/jetstream";
import { schemaResolvers } from "@app/parcel-delivery/resolver/avro-schema";
import { CreateParcelDeliveryInput } from "@app/parcel-delivery/resolver/request-type";
import { ImportManagerSaveError } from "./error";

@Injectable()
export class ParcelImportService
  implements IParcelImportService, OnModuleDestroy
{
  private readonly schemaVersion = "v1";
  private readonly consumerName = "parcel-event-consumer";
  private readonly streamName = "parcels";
  private readonly subjectName = "parcel-event";

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
        this.consumerName,
        this.streamName,
        this.subjectName
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
      const messages = await this.jetStreamConsumerService.getMessageBuffer(
        this.subjectName
      );
      console.log(messages.length);
      if (messages.length > 0) {
        const processedMessages = messages.map((msg) =>
          this.decodeParcelEvent(msg.data)
        );

        await this.saveDataToDatabase(processedMessages);
        this.jetStreamConsumerService.clearMessageBuffer(this.subjectName);
      } else {
        console.log("No messages to process for", this.subjectName);
      }
    } catch (error) {
      console.error("Error consuming messages:", error);
    }
  }

  async saveDataToDatabase(data: CreateParcelDeliveryInput[]) {
    try {
      await this.parcelRepository.upsertMany(data);
      console.log("Saved to database for", this.subjectName);
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
      console.log(
        "NATS connection closed on module destroy for",
        this.subjectName
      );
    } catch (error) {
      console.error("Error disconnecting from NATS:", error);
    }
  }
}
