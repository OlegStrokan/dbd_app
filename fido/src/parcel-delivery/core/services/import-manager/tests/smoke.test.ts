import { Test, TestingModule } from '@nestjs/testing';
import { createDbTestingModule } from '../../../../infrastructure/common/db/create-db-module';
import { ParcelDeliveryRepository } from '../../../../infrastructure/repositories/parcel-delivery';
import * as fs from 'fs';
import {IImportManagerService} from "../interfaces";
import {IParcelDeliveryRepository} from "../../../repositories/parcel-delivery";
import {ImportDataService} from "../index";

describe('ImportDataService', () => {
    let importManagerService: IImportManagerService;
    let parcelDeliveryRepository: IParcelDeliveryRepository;
    let module: TestingModule;

    beforeAll(async () => {
        module = await createDbTestingModule();

        importManagerService = module.get<IImportManagerService>(ImportDataService);
        parcelDeliveryRepository = module.get<IParcelDeliveryRepository>(
            ParcelDeliveryRepository,
        );
    });

    afterAll(async () => {
        await parcelDeliveryRepository.deleteAll();
        await module.close();
    });

    it('should fetch data and save to the database', async () => {
        const testData = {
            parcelDelivery: [
                {
                    id: 2793209,
                    parcelNumber: 202380,
                    name: "Parcel 1"
                },
                {
                    id: 12910,
                    parcelNumber: 272890,
                    name: "Parcel 2"
                }
            ]
        }

        jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(testData));

        await importManagerService.fetchDataAndSaveToDb();

        const savedParcels = await parcelDeliveryRepository.findAll();

        expect(savedParcels).toHaveLength(testData.parcelDelivery.length);
    });
});

