import { IParcelDelivery } from "../../../use-cases/create-parcel-delivery/interfaces";
import { IParcelDeliveryRepository } from "../index";
import { TestingModule } from "@nestjs/testing";
import { createDbTestingModule } from "../../../../common/db/create-db-module";
import { ParcelDeliveryService } from "../../../use-cases/create-parcel-delivery";
import { ParcelDeliveryRepository } from "../../../../domain/repositories/parcel-delivery";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ParcelDeliveryMocks } from "../mock";

describe('ParcelDeliveryService', () => {
  let parcelDeliveryService: IParcelDelivery;
  let parcelDeliveryRepository: IParcelDeliveryRepository
  let module: TestingModule;

  beforeAll(async () => {
    module = await createDbTestingModule();

    parcelDeliveryService = module.get<IParcelDelivery>(ParcelDeliveryService);
    parcelDeliveryRepository = module.get<IParcelDeliveryRepository>(ParcelDeliveryRepository)
  });

  afterAll(async () => {
    await module.close();
  });


  it('should create a parcel delivery and verify its existence', async () => {

    const createdParcelDelivery = await parcelDeliveryService.create(ParcelDeliveryMocks.getOneData());

    expect(createdParcelDelivery).toBeDefined();

    const retrievedParcelDelivery = await parcelDeliveryRepository.findOneById(createdParcelDelivery.id);
    expect(retrievedParcelDelivery).toBeDefined();
    expect(retrievedParcelDelivery.id).toEqual(createdParcelDelivery.id);
  });
});
