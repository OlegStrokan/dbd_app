import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {IParcelDeliveryRepository} from "../../repositories/parcel-delivery";
import {IImportManagerService} from "./interfaces";
import {CreateParcelDeliveryInput} from "../../use-cases/create-parcel-delivery/dto/create-parcel-delivery.input";
import {InjectRepository} from "@nestjs/typeorm";
import {ParcelDeliveryRepository} from "../../../infrastructure/repositories/parcel-delivery";
import * as fs from "fs";
import {ParcelDeliveryEntity} from "../../../infrastructure/entities/parcel-delivery";


interface ParsedJson {
    parcelDelivery: ParcelDeliveryEntity[];
}

@Injectable()
export class ImportDataService implements IImportManagerService {
    constructor(
        @InjectRepository(ParcelDeliveryRepository)
        private readonly parcelRepository: IParcelDeliveryRepository
    ) {}

    @Cron('0 0 * * *', { name: 'ImportParcelsCronJob' })
    async fetchDataAndSaveToDb() {
        try {
            const rawData = fs.readFileSync('./parcel-events.json', 'utf8');
            const data: ParsedJson = JSON.parse(rawData);

            await this.saveDataToDatabase(data.parcelDelivery);
        } catch (error) {}
    }

    async saveDataToDatabase(data: CreateParcelDeliveryInput[]) {
        try {
            await this.parcelRepository.upsertMany(data);
        } catch (error) {
            throw new Error('Error saving data to db')
        }
    }
}
