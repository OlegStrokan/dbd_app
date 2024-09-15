import { createDbTestingModule } from "../../../../services/database/create-db-module";
import { TestingModule } from "@nestjs/testing";
import { IParcelDeliveryRepository } from "../../../repository";
import { ICreateParcelDeliveryUseCase } from "../interfaces";
import { CreateParcelDeliveryUseCase } from "../index";
import { ParcelDeliveryRepository } from "../../../infrastructure/repository/parcel-delivery";
import { parcelDeliveryMocks } from "../../../repository/mocks";
import { clearRepos } from "../../../../shared/tools/configs/clear.config";
import { generateUuid } from "../../../../shared/libs/generateUuid/generateUuid";

describe("ParcelDeliveryService", () => {
  let parcelDeliveryService: ICreateParcelDeliveryUseCase;
  let parcelDeliveryRepository: IParcelDeliveryRepository;
  let module: TestingModule;
  let parcelId: string;

  beforeAll(async () => {
    module = await createDbTestingModule();

    parcelDeliveryService = module.get<ICreateParcelDeliveryUseCase>(
      CreateParcelDeliveryUseCase
    );
    parcelDeliveryRepository = module.get<IParcelDeliveryRepository>(
      ParcelDeliveryRepository
    );

    parcelId = generateUuid();
  });

  beforeEach(async () => {
    await clearRepos(module);
  });

  afterAll(async () => {
    await module.close();
  });

  const mockParcel = parcelDeliveryMocks.getOne({
    id: parcelId,
    // name: 'USB-C kabel 2m',
    parcelNumber: "200392903",
  });

  it("should create a parcel delivery and verify its existence", async () => {
    const createdParcel = await parcelDeliveryService.create(mockParcel);

    expect(createdParcel).toBeDefined();

    const retrievedParcelDelivery = await parcelDeliveryRepository.findOneById(
      createdParcel.data.id
    );
    expect(retrievedParcelDelivery).toBeDefined();
    expect(retrievedParcelDelivery.data.id).toEqual(createdParcel.data.id);
  });

  it("should throw error when parcel already exist ", async () => {
    await parcelDeliveryService.create(mockParcel);
    await expect(
      async () => await parcelDeliveryService.create(mockParcel)
    ).rejects.toThrowError(Error);
  });
});
