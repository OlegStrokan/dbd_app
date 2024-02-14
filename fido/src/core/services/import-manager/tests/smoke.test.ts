import { TestingModule } from '@nestjs/testing';
import { createDbTestingModule } from '../../../../infrastructure/common/db/create-db-module';
import { ParcelDeliveryRepository } from '../../../../infrastructure/repositories/parcel-delivery';
import * as fs from 'fs';
import {IImportManagerService} from "../interfaces";
import {IParcelDeliveryRepository} from "../../../repositories/parcel-delivery";
import {ImportDataService} from "../index";
import {SchedulerRegistry} from "@nestjs/schedule";
import {clearRepos} from "../../../../infrastructure/common/config/clear.config";

describe('ImportDataService', () => {
    let importManagerService: IImportManagerService;
    let parcelDeliveryRepository: IParcelDeliveryRepository;
    let schedulerRegistry: SchedulerRegistry;
    let module: TestingModule;

    beforeAll(async () => {
        module = await createDbTestingModule();

        importManagerService = module.get<IImportManagerService>(ImportDataService);
        parcelDeliveryRepository = module.get<IParcelDeliveryRepository>(
            ParcelDeliveryRepository,
        );
        schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);

    });

    afterAll(async () => {
       await clearRepos(module)
        await module.close();
    });

    it('should fetch data and save to the database', async () => {

        const testData = {
            parcelDelivery: [
                {
                    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                    parcelNumber: 202380,
                    name: "Parcel 1"
                },
                {
                    id: "123e4567-e89b-12d3-a456-426614174001",
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

    it('should trigger the cron job and fetch data', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() => new Date('2024-01-15T01:00:00').getTime());

        console.log(schedulerRegistry.getCronJobs())
        schedulerRegistry.getCronJob('ImportParcelsCronJob');

        await new Promise(resolve => setTimeout(resolve, 100));

        const savedParcels = await parcelDeliveryRepository.findAll();
        expect(savedParcels).toHaveLength(10);

        jest.restoreAllMocks();
    });
});

