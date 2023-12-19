
import { Test, TestingModule } from '@nestjs/testing';
import {ParcelDeliveryRepository} from "../../../../domain/repositories/parcel-delivery";
import {createDbTestingModule} from "../../../../common/db/create-db-module";
import {IParcelDeliveryRepository} from "../index";
import {ParcelDeliveryMocks} from "../mock";

describe('ParcelDeliveryRepository', () => {
    let parcelDeliveryRepository: IParcelDeliveryRepository;
    let module: TestingModule;

    beforeAll(async () => {
        module = await createDbTestingModule();
        parcelDeliveryRepository = module.get<IParcelDeliveryRepository>(ParcelDeliveryRepository)


        await parcelDeliveryRepository.upsertMany([
            ParcelDeliveryMocks.getOneData(),
            ParcelDeliveryMocks.getOneData(),
        ]);

    });

    afterAll(async () => {
        await parcelDeliveryRepository.deleteAll()
        await module.close();

    });

    it('should find one parcel delivery by ID', async () => {
        const parcels = await parcelDeliveryRepository.findAll();
        const foundParcel = await parcelDeliveryRepository.findOneById(parcels[0].id);
        expect(foundParcel).toBeDefined();
    });

    it('should find all parcel deliveries', async () => {
        const parcels = await parcelDeliveryRepository.findAll();
        expect(parcels).toHaveLength(2); // Assuming two default parcels are inserted
    });

    it('should upsert one parcel delivery', async () => {
        const createdParcel = await parcelDeliveryRepository.upsertOne(ParcelDeliveryMocks.getOne({
            name: 'Test Parcel',
            parcelNumber: 12345,
        }));
        expect(createdParcel).toBeDefined();
    });

    it('should upsert many parcel deliveries', async () => {
        const parcelDeliveries =  [
            ParcelDeliveryMocks.getOne({ name: 'Parcel 1', parcelNumber: 1002 }),
            ParcelDeliveryMocks.getOne({ name: 'Parcel 2', parcelNumber: 1002 }),
        ];
        const createdParcels = await parcelDeliveryRepository.upsertMany(parcelDeliveries);
        expect(createdParcels).toHaveLength(parcelDeliveries.length);
    });

});
