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
    this.natsService.connect();
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  consumeNatsMessages() {
    const nats = this.natsService.getConnection;
    const subject = "parcel-event";
    console.log("init");
    nats.subscribe(subject, {
      callback: async (err: any, bufferMessage: Msg) => {
        if (err) {
          console.error("Error consuming NATS message:", err);
          return;
        }

        try {
          const decodedParcel = Object.keys(schemaResolvers)
            .map((version) => ({
              version,
              data: schemaResolvers[version].schema.fromBuffer(
                bufferMessage.data
              ),
            }))
            .find((result) => result.data !== null);

          if (decodedParcel) {
            const message = decodedParcel.data as CreateParcelDeliveryInput;
            this.messageBuffer.push(message);
            console.log(bufferMessage.data);
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

  async saveDataToDatabase(data: CreateParcelDeliveryInput[]) {
    try {
      await this.parcelRepository.upsertMany(data);
    } catch (error) {
      throw new ImportManagerSaveError("error saving data to database", {
        ...data,
      });
    }
  }
}
