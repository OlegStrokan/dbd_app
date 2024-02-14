import {RedisPrefixes} from "../../index";
import {TestingModule} from "@nestjs/testing";
import {IRedisService} from "../../../../services/redis/interfaces";
import {RedisService} from "../../../../services/redis";

export interface IRedisCache {
    prefix: RedisPrefixes,
    key: string;
    value: string;
}
export const createRedisCache = async (module: TestingModule, {prefix, key, value}: IRedisCache) => {
    const redisService = module.get<IRedisService>(RedisService)
    return await redisService.setWithPrefix(prefix, key, value)
}



export const createRedisCacheWithExpiry = async (module: TestingModule, {prefix, key, value, expiry}: IRedisCache & { expiry: number }) => {
    const prefixKey = `${prefix}:${key}`
    const redisService = module.get<IRedisService>(RedisService)
    return await redisService.setWithExpiryAndPrefix(prefix, key, value, expiry)
}
