import {createRedisCache, createRedisCacheWithExpiry} from "./data";

export const redisMocks = {
    createOne: createRedisCache,
    createOneWithExpiry: createRedisCacheWithExpiry
}
