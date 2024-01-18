import {createDbTestingModule} from "../../../../infrastructure/common/db/create-db-module";
import {TestingModule} from "@nestjs/testing";
import {IParcelDeliveryRepository} from "../../../repositories/parcel-delivery";
import {IParcelDeliveryUseCase} from "../interfaces";
import {ParcelDeliveryUseCase} from "../index";
import {ParcelDeliveryRepository} from "../../../../infrastructure/repositories/parcel-delivery";
import {ParcelDeliveryMocks} from "../../../repositories/parcel-delivery/mock";

describe('ParcelDeliveryService', () => {
  let parcelDeliveryService: IParcelDeliveryUseCase;
  let parcelDeliveryRepository: IParcelDeliveryRepository
  let module: TestingModule;

  beforeAll(async () => {
    module = await createDbTestingModule();

    parcelDeliveryService = module.get<IParcelDeliveryUseCase>(ParcelDeliveryUseCase);
    parcelDeliveryRepository = module.get<IParcelDeliveryRepository>(ParcelDeliveryRepository)
  });

  afterAll(async () => {
    await parcelDeliveryRepository.deleteAll()
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
