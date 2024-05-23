import { createDbTestingModule } from "../../../../infrastructure/common/db/create-db-module";
import { TestingModule } from "@nestjs/testing";
import { IParcelDeliveryRepository } from "../../../repositories/parcel-delivery";
import { GetParcelDeliveryUseCase } from "../index";
import { ParcelDeliveryRepository } from "../../../../infrastructure/repositories/parcel-delivery";
import { IGetParcelDeliveryUseCase } from "../interfaces";
import { parcelDeliveryMocks } from "../../../repositories/parcel-delivery/mocks";
import { IRedisService } from "../../../services/redis/interfaces";
import { RedisService } from "../../../services/redis";
import { RedisPrefixes } from "../../../repositories/redis";
import { generateUuid } from "../../../../libs/generateUuid/generateUuid";
import { clearRepos } from "../../../../infrastructure/common/config/clear.config";

describe("GetParcelDeliveryUseCase", () => {
  let parcelDeliveryUseCase: IGetParcelDeliveryUseCase;
  let redisService: IRedisService;
  let module: TestingModule;
  beforeAll(async () => {
    module = await createDbTestingModule();

    parcelDeliveryUseCase = module.get<IGetParcelDeliveryUseCase>(
      GetParcelDeliveryUseCase
    );
    redisService = module.get<IRedisService>(RedisService);
  });

  beforeEach(async () => {
    await redisService.deleteWithPrefix(RedisPrefixes.PARCEL, createdParcel.id);
    await clearRepos(module);
  });

  afterAll(async () => {
    await module.close();
  });

  const createdParcel = parcelDeliveryMocks.getOne({
    // name: "USB-C kabel 2m",
    parcelNumber: "200392903",
  });

  it("should find a parcel delivery if cache exist", async () => {
    await redisService.setWithPrefix(
      RedisPrefixes.PARCEL,
      createdParcel.id,
      JSON.stringify(createdParcel)
    );

    const foundParcelDelivery = await parcelDeliveryUseCase.getOne(
      createdParcel.id
    );

    expect(foundParcelDelivery).toEqual(createdParcel);
  });

  it("should find a parcel delivery when cache dont exist", async () => {
    await parcelDeliveryMocks.createOne(createdParcel, module);

    const foundParcelDelivery = await parcelDeliveryUseCase.getOne(
      createdParcel.id
    );

    expect(foundParcelDelivery).toEqual(createdParcel);
  });

  it("should throw error when parcel delivery dont exist in cache and database", async () => {
    await expect(
      async () => await parcelDeliveryUseCase.getOne(createdParcel.id)
    ).rejects.toThrowError(Error);
  });
});
