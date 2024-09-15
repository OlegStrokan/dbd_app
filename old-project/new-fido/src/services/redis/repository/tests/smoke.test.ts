import { IRedisRepository, RedisPrefixes } from "../index";
import { TestingModule } from "@nestjs/testing";
import { clearRepos } from "../../../../shared/tools/configs/clear.config";
import { createDbTestingModule } from "../../../database/create-db-module";
import { RedisRepository } from "../../infrastructure/repository";

describe("RedisRepository", () => {
  let redisRepository: IRedisRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await createDbTestingModule();
    redisRepository = module.get<IRedisRepository>(RedisRepository);
  });

  beforeEach(async () => {
    await redisRepository.clear();
  });

  afterAll(async () => {
    await clearRepos(module);
    await module.close();
  });

  describe("RedisRepository tests", () => {
    const redisTestKey = "20392309";
    const redisTestValue = JSON.stringify([
      { id: redisTestKey, data: "Hello World" },
    ]);
    const redisTestExpiry = 1;

    it("should set and get value from Redis", async () => {
      await redisRepository.set(
        RedisPrefixes.PARCEL,
        redisTestKey,
        redisTestValue
      );
      const value = await redisRepository.get(
        RedisPrefixes.PARCEL,
        redisTestKey
      );
      expect(value).toBe(redisTestValue);
    });

    it("should set value with expiry and get it from Redis", async () => {
      await redisRepository.setWithExpiry(
        RedisPrefixes.PARCEL,
        redisTestKey,
        redisTestValue,
        redisTestExpiry
      );
      const value = await redisRepository.get(
        RedisPrefixes.PARCEL,
        redisTestKey
      );
      expect(value).toBe(redisTestValue);
    });

    it("should set value with expiry and get it from Redis and failed after expiry will finish", async () => {
      await redisRepository.setWithExpiry(
        RedisPrefixes.PARCEL,
        redisTestKey,
        redisTestValue,
        redisTestExpiry
      );
      await new Promise((resolve) =>
        setTimeout(resolve, redisTestExpiry + 1000)
      );
      const value = await redisRepository.get(
        RedisPrefixes.PARCEL,
        redisTestKey
      );
      expect(value).toBeNull();
    });

    it("should set value with NX option and get it from Redis", async () => {
      const result = await redisRepository.setAtomicOperation(
        RedisPrefixes.PARCEL,
        redisTestKey,
        redisTestValue,
        redisTestExpiry
      );
      expect(result).toBe("OK");
      const value = await redisRepository.get(
        RedisPrefixes.PARCEL,
        redisTestKey
      );
      expect(value).toBe(redisTestValue);
    });

    it("should delete value from Redis", async () => {
      await redisRepository.set(
        RedisPrefixes.PARCEL,
        redisTestKey,
        redisTestValue
      );
      await redisRepository.delete(RedisPrefixes.PARCEL, redisTestKey);
      const value = await redisRepository.get(
        RedisPrefixes.PARCEL,
        redisTestKey
      );
      expect(value).toBeNull();
    });

    it("should clear Redis", async () => {
      await redisRepository.set(
        RedisPrefixes.PARCEL,
        redisTestKey,
        redisTestValue
      );
      await redisRepository.clear();
      const value = await redisRepository.get(
        RedisPrefixes.PARCEL,
        redisTestKey
      );
      expect(value).toBeNull();
    });
  });
});
