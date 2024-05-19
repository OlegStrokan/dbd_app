import { Inject, Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { IParcelDeliveryRepository } from "../../repositories/parcel-delivery";
import { IParcelImportService } from "./interfaces";
import { CreateParcelDeliveryInput } from "../../../interfaces/parcel-delivery/request-type/create-parcel-delivery.input";
import { ParcelDeliveryRepository } from "../../../infrastructure/repositories/parcel-delivery";
import * as fs from "fs";
import { ParcelDeliveryEntity } from "../../../infrastructure/entities/parcel-delivery";
import { ImportManagerSaveError } from "./error";
import { ActionLoggerService } from "../action-logger";
import {
  IActionLoggerService,
  KnownActionNames,
} from "../action-logger/interfaces";
import { ClientProxy } from "@nestjs/microservices";
import { NatsService } from "../nats";

interface ParsedJson {
  parcelDelivery: ParcelDeliveryEntity[];
}

@Injectable()
export class ParcelImportService implements IParcelImportService {
  constructor(
    @Inject(ParcelDeliveryRepository)
    private readonly parcelRepository: IParcelDeliveryRepository,
    @Inject(ActionLoggerService)
    private readonly actionLogger: IActionLoggerService,
    @Inject(NatsService)
    private readonly natsService: NatsService
  ) {}

  @Cron("0 0 * * *", { name: "ParcelImportServiceCronJob" })
  async fetchDataAndSaveToDb() {
    await this.actionLogger.attemptAction(
      {
        name: KnownActionNames.ImportManagerSaveToDb,
      },
      async () => {
        try {
          const rawData = fs.readFileSync("./parcel-events.json", "utf8");
          const data: ParsedJson = JSON.parse(rawData);

          await this.saveDataToDatabase(data.parcelDelivery);
        } catch (error) {}
      }
    );
  }

  async saveDataToDatabase(data: CreateParcelDeliveryInput[]) {
    try {
      await this.parcelRepository.upsertMany(data);
    } catch (error) {
      throw new ImportManagerSaveError("Error saving data to db", {
        ...data,
      });
    }
  }

  async consumeNatsMessages() {
    try {
      await this.natsService.connect("nats://localhost:4222", "parcel-event");

      const nats = this.natsService.getConnection;

      const sub = nats.subscribe("parcel-event");

      for await (const m of sub) {
        const message = Buffer.from(m.data);
        console.log(
          `Received a message: ${m.subject} ${m.data}, ${message.toString()}`
        );
      }
    } catch (error) {
      console.error("Error consuming NATS messages:", error);
    }
  }
}
