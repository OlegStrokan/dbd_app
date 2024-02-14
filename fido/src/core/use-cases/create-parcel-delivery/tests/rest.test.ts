import {createDbTestingModule} from "../../../../infrastructure/common/db/create-db-module";
import {TestingModule} from "@nestjs/testing";
import {IParcelDeliveryRepository} from "../../../repositories/parcel-delivery";
import {ICreateParcelDeliveryUseCase} from "../interfaces";
import {CreateParcelDeliveryUseCase} from "../index";
import {ParcelDeliveryRepository} from "../../../../infrastructure/repositories/parcel-delivery";
import {parcelDeliveryMocks} from "../../../repositories/parcel-delivery/mocks";
import {clearRepos} from "../../../../infrastructure/common/config/clear.config";

describe('ParcelDeliveryService', () => {
  let parcelDeliveryService: ICreateParcelDeliveryUseCase;
  let parcelDeliveryRepository: IParcelDeliveryRepository
  let module: TestingModule;

  beforeAll(async () => {
    module = await createDbTestingModule();

    parcelDeliveryService = module.get<ICreateParcelDeliveryUseCase>(CreateParcelDeliveryUseCase);
    parcelDeliveryRepository = module.get<IParcelDeliveryRepository>(ParcelDeliveryRepository)
  });

  afterAll(async () => {
    await clearRepos(module)
    await module.close();
  });


  it('should create a parcel delivery and verify its existence', async () => {

    const createdParcelDelivery = await parcelDeliveryService.create(parcelDeliveryMocks.getOne());

    expect(createdParcelDelivery).toBeDefined();

    const retrievedParcelDelivery = await parcelDeliveryRepository.findOneById(createdParcelDelivery.id);
    expect(retrievedParcelDelivery).toBeDefined();
    expect(retrievedParcelDelivery.id).toEqual(createdParcelDelivery.id);
  });
});
