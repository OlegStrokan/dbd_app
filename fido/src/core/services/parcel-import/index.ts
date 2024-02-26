import {Inject, Injectable} from '@nestjs/common';
import {Cron} from '@nestjs/schedule';
import {IParcelDeliveryRepository} from "../../repositories/parcel-delivery";
import {IParcelImportService} from "./interfaces";
import {CreateParcelDeliveryInput} from "../../../interfaces/parcel-delivery/request-type/create-parcel-delivery.input";
import {ParcelDeliveryRepository} from "../../../infrastructure/repositories/parcel-delivery";
import * as fs from "fs";
import {ParcelDeliveryEntity} from "../../../infrastructure/entities/parcel-delivery";
import {ImportManagerSaveError} from "./error";
import {ActionLoggerService} from "../action-logger";
import {IActionLoggerService, KnownActionNames} from "../action-logger/interfaces";


interface ParsedJson {
    parcelDelivery: ParcelDeliveryEntity[];
}

@Injectable()
export class ParcelImportService implements IParcelImportService {
    constructor(
        @Inject(ParcelDeliveryRepository)
        private readonly parcelRepository: IParcelDeliveryRepository,
        @Inject(ActionLoggerService)
        private readonly actionLogger: IActionLoggerService
    ) {}

    @Cron('0 0 * * *', { name: 'ParcelImportServiceCronJob' })
    async fetchDataAndSaveToDb() {
         await this.actionLogger.attemptAction({
             name: KnownActionNames.ImportManagerSaveToDb,
         }, async () => {
            try {
                const rawData = fs.readFileSync('./parcel-events.json', 'utf8');
                const data: ParsedJson = JSON.parse(rawData);

                await this.saveDataToDatabase(data.parcelDelivery);
            } catch (error) {
            }
        })
    }

    async saveDataToDatabase(data: CreateParcelDeliveryInput[]) {
        try {
            await this.parcelRepository.upsertMany(data);
        } catch (error) {
            throw new ImportManagerSaveError('Error saving data to db', {
                ...data
            })
        }
    }
}
