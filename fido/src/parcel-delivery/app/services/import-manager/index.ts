import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {IParcelDeliveryRepository} from "../../repositories/parcel-delivery";
import {fsReadFile} from "ts-loader/dist/utils";
import {IImportManagerService} from "./interfaces";
import {CreateParcelDeliveryInput} from "../../use-cases/create-parcel-delivery/dto/create-parcel-delivery.input";

@Injectable()
export class ImportDataService implements IImportManagerService {
    constructor(private readonly parcelRepository: IParcelDeliveryRepository) {}

    @Cron('0 0 * * *')
    async fetchDataAndSaveToDb() {
        try {
            const rawData = fsReadFile('./parcel-events.json', 'utf8');
            const data = JSON.parse(rawData);

            await this.saveDataToDatabase(data);
        } catch (error) {}
    }

    async saveDataToDatabase(data: CreateParcelDeliveryInput[]) {
        try {
            await this.parcelRepository.upsertMany(data);
        } catch (error) {
        }
    }
}
