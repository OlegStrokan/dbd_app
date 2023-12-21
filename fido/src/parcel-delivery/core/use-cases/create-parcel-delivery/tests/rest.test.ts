import {createDbTestingModule} from "../../../../infrastructure/common/db/create-db-module";
import {TestingModule} from "@nestjs/testing";
import {IParcelDeliveryRepository} from "../../../repositories/parcel-delivery";
import {IParcelDelivery} from "../interfaces";
import {ParcelDeliveryService} from "../index";
import {ParcelDeliveryRepository} from "../../../../infrastructure/repositories/parcel-delivery";
import {ParcelDeliveryMocks} from "../../../repositories/parcel-delivery/mock";

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
