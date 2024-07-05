import { RedisRepository } from "@app/services/redis/infrastructure/repository";
import { IRedisRepository, RedisPrefixes } from "../../index";
import { TestingModule } from "@nestjs/testing";

export interface IRedisCache {
  prefix: RedisPrefixes;
  key: string;
  value: string;
}
export const createRedisCache = async (
  module: TestingModule,
  { prefix, key, value }: IRedisCache
) => {
  const redisService = module.get<IRedisRepository>(RedisRepository);
  return await redisService.set(prefix, key, value);
};

export const createRedisCacheWithExpiry = async (
  module: TestingModule,
  { prefix, key, value, expiry }: IRedisCache & { expiry: number }
) => {
  const redisService = module.get<IRedisRepository>(RedisRepository);
  return await redisService.setWithExpiry(prefix, key, value, expiry);
};
