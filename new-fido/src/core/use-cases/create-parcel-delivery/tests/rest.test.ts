import { createDbTestingModule } from "../../../../infrastructure/common/db/create-db-module";
import { TestingModule } from "@nestjs/testing";
import { IParcelDeliveryRepository } from "../../../repositories/parcel-delivery";
import { ICreateParcelDeliveryUseCase } from "../interfaces";
import { CreateParcelDeliveryUseCase } from "../index";
import { ParcelDeliveryRepository } from "../../../../infrastructure/repositories/parcel-delivery";
import { parcelDeliveryMocks } from "../../../repositories/parcel-delivery/mocks";
import { clearRepos } from "../../../../infrastructure/common/config/clear.config";
import { generateUuid } from "../../../../libs/generateUuid/generateUuid";

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
      createdParcel.id
    );
    expect(retrievedParcelDelivery).toBeDefined();
    expect(retrievedParcelDelivery.id).toEqual(createdParcel.id);
  });

  it("should throw error when parcel already exist ", async () => {
    await parcelDeliveryService.create(mockParcel);
    await expect(
      async () => await parcelDeliveryService.create(mockParcel)
    ).rejects.toThrowError(Error);
  });
});
