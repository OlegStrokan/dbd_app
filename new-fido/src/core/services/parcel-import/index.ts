import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { IParcelDeliveryRepository } from "../../repositories/parcel-delivery";
import { IParcelImportService } from "./interfaces";
import { CreateParcelDeliveryInput } from "../../../interfaces/parcel-delivery/request-type/create-parcel-delivery.input";
import { ParcelDeliveryRepository } from "../../../infrastructure/repositories/parcel-delivery";
import { ImportManagerSaveError } from "./error";
import { ActionLoggerService } from "../action-logger";
import {
  IActionLoggerService,
  KnownActionNames,
} from "../action-logger/interfaces";
import { schemaResolvers } from "src/interfaces/parcel-delivery/avro-schema";
import { JetStreamConsumerService } from "../nats/jetstream";

@Injectable()
export class ParcelImportService
  implements IParcelImportService, OnModuleDestroy
{
  private messageBuffer: CreateParcelDeliveryInput[] = [];
  private readonly batchSize = 10;

  constructor(
    @Inject(ParcelDeliveryRepository)
    private readonly parcelRepository: IParcelDeliveryRepository,
    @Inject(ActionLoggerService)
    private readonly actionLogger: IActionLoggerService,
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
    const schemaResolver = schemaResolvers["v1"];
    if (!schemaResolver) return null;

    try {
      const { schema } = schemaResolver;
      return schema.fromBuffer(buffer);
    } catch (error) {
      console.log(error, "Error decoding buffer");
      return null;
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async consumeNatsMessages() {
    if (this.messageBuffer.length >= this.batchSize) {
      console.log(this.messageBuffer.length);
      await this.saveDataToDatabase(this.messageBuffer);
      this.messageBuffer = [];
    }
  }

  async saveDataToDatabase(data: CreateParcelDeliveryInput[]) {
    try {
      await this.parcelRepository.upsertMany(data);
    } catch (error) {
      throw new ImportManagerSaveError("error saving data to database", {
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
