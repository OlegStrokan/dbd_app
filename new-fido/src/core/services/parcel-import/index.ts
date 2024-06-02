import { Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { IParcelDeliveryRepository } from "../../repositories/parcel-delivery";
import { IParcelImportService } from "./interfaces";
import { CreateParcelDeliveryInput } from "../../../interfaces/parcel-delivery/request-type/create-parcel-delivery.input";
import { ParcelDeliveryRepository } from "../../../infrastructure/repositories/parcel-delivery";
import { ParcelDeliveryEntity } from "../../../infrastructure/entities/parcel-delivery";
import { ImportManagerSaveError } from "./error";
import { ActionLoggerService } from "../action-logger";
import {
  IActionLoggerService,
  KnownActionNames,
} from "../action-logger/interfaces";
import { ClientProxy } from "@nestjs/microservices";
import { NatsService } from "../nats";
import { Msg } from "nats";
import { schemaResolvers } from "src/interfaces/parcel-delivery/avro-schema";

interface ParsedJson {
  parcelDelivery: ParcelDeliveryEntity[];
}

@Injectable()
export class ParcelImportService implements IParcelImportService {
  private messageBuffer: CreateParcelDeliveryInput[] = [];
  private readonly batchSize = 10;

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
    await this.natsService.connect();
    this.subscribeToNatsMessages();
  }
  subscribeToNatsMessages() {
    const nats = this.natsService.getConnection;
    const subject = "parcel-event";
    console.log("init");

    const decodeParcelEvent = (buffer) => {
      const schemaResolver = schemaResolvers["v1"];
      if (!schemaResolver) return null;

      try {
        const { schema } = schemaResolver;
        return schema.fromBuffer(buffer);
      } catch (error) {
        console.log(error, "Error decoding buffer");
        return null;
      }
    };

    nats.subscribe(subject, {
      callback: async (err: any, bufferMessage: Msg) => {
        if (err) {
          console.error("Error consuming NATS message:", err);
          return;
        }

        try {
          const decodedParcel = decodeParcelEvent(bufferMessage.data);

          if (decodedParcel) {
            const message = decodedParcel as any;
            console.log(message.updatedAt, "message");
            this.messageBuffer.push(message);

            if (this.messageBuffer.length >= this.batchSize) {
              console.log(this.messageBuffer.length);
              await this.saveDataToDatabase(this.messageBuffer);
              this.messageBuffer = [];
            }
          }
        } catch (error) {
          console.error("Error decoding buffer:", error);
        }
      },
    });
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
}
