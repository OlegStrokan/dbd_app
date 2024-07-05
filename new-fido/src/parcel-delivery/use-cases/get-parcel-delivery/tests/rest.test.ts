import { parcelDeliveryMocks } from "@app/parcel-delivery/repository/mocks";
import { createDbTestingModule } from "@app/services/database/create-db-module";
import { RedisRepository } from "@app/services/redis/infrastructure/repository";
import {
  IRedisRepository,
  RedisPrefixes,
} from "@app/services/redis/repository";
import { clearRepos } from "@app/shared/tools/configs/clear.config";
import { TestingModule } from "@nestjs/testing";
import { GetParcelDeliveryUseCase } from "..";
import { IGetParcelDeliveryUseCase } from "../interfaces";

describe("GetParcelDeliveryUseCase", () => {
  let parcelDeliveryUseCase: IGetParcelDeliveryUseCase;
  let redisRepository: IRedisRepository;
  let module: TestingModule;
  beforeAll(async () => {
    module = await createDbTestingModule();

    parcelDeliveryUseCase = module.get<IGetParcelDeliveryUseCase>(
      GetParcelDeliveryUseCase
    );
    redisRepository = module.get<IRedisRepository>(RedisRepository);
  });

  beforeEach(async () => {
    await redisRepository.delete(RedisPrefixes.PARCEL, createdParcel.id);
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
    await redisRepository.set(
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
