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
import { NatsService } from "../nats";
import { schemaResolvers } from "src/interfaces/parcel-delivery/avro-schema";
import { JsMsg, StringCodec, AckPolicy } from "nats"; // Import AckPolicy from 'nats'
import { createJetStreamConsumer } from "../nats/jetstream";

@Injectable()
export class ParcelImportService
  implements IParcelImportService, OnModuleDestroy
{
  private messageBuffer: CreateParcelDeliveryInput[] = [];
  private readonly batchSize = 10;
  private subscription: any;

  constructor(
    @Inject(ParcelDeliveryRepository)
    private readonly parcelRepository: IParcelDeliveryRepository,
    @Inject(ActionLoggerService)
    private readonly actionLogger: IActionLoggerService,
    @Inject(NatsService)
    private readonly natsService: NatsService
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
      createJetStreamConsumer().then(() => {
        console.log("JetStream consumer started");
      });
      console.log("Subscribed to NATS messages with JetStream");
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
    if (this.subscription) {
      try {
        await this.subscription.unsubscribe();
        console.log("Unsubscribed from NATS messages");
      } catch (error) {
        console.error("Error unsubscribing from NATS messages:", error);
      }
    }
    try {
      await this.natsService.disconnect();
      console.log("NATS connection closed on module destroy.");
    } catch (error) {
      console.error("Error disconnecting from NATS:", error);
    }
  }
}
