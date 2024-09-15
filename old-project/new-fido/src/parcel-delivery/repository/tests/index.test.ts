import { TestingModule } from "@nestjs/testing";
import { ParcelDeliveryRepository } from "../../infrastructure/repository/parcel-delivery";
import { createDbTestingModule } from "../../../services/database/create-db-module";
import { IParcelDeliveryRepository } from "../index";
import { parcelDeliveryMocks } from "../mocks";
import { clearRepos } from "../../../shared/tools/configs/clear.config";

describe("ParcelDeliveryRepository", () => {
  let parcelDeliveryRepository: IParcelDeliveryRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await createDbTestingModule();
    parcelDeliveryRepository = module.get<IParcelDeliveryRepository>(
      ParcelDeliveryRepository
    );
  });

  beforeEach(async () => {
    await clearRepos(module);
  });

  afterAll(async () => {
    await clearRepos(module);
    await module.close();
  });

  it("should find one parcel delivery by ID", async () => {
    // TODO make mock function for createMany parcels
    await parcelDeliveryRepository.upsertMany([
      parcelDeliveryMocks.getOne(),
      parcelDeliveryMocks.getOne(),
    ]);
    const parcels = await parcelDeliveryRepository.findAll();
    const foundParcel = await parcelDeliveryRepository.findOneById(
      parcels[0].data.id
    );
    expect(foundParcel).toBeDefined();
  });

  it("should find all parcel deliveries", async () => {
    await parcelDeliveryRepository.upsertMany([
      parcelDeliveryMocks.getOne(),
      parcelDeliveryMocks.getOne(),
    ]);
    const parcels = await parcelDeliveryRepository.findAll();
    expect(parcels).toHaveLength(2);
  });

  it("should upsert one parcel delivery", async () => {
    const createdParcel = await parcelDeliveryRepository.upsertOne(
      parcelDeliveryMocks.getOne()
    );
    expect(createdParcel).toBeDefined();
  });

  it("should upsert many parcel deliveries", async () => {
    const parcelDeliveries = [
      parcelDeliveryMocks.getOne(),
      parcelDeliveryMocks.getOne(),
    ];
    const createdParcels = await parcelDeliveryRepository.upsertMany(
      parcelDeliveries
    );
    expect(createdParcels).toHaveLength(parcelDeliveries.length);
  });
});
