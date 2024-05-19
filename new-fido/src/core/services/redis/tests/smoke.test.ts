import {TestingModule} from "@nestjs/testing";
import {clearRepos} from "../../../../infrastructure/common/config/clear.config";
import {createDbTestingModule} from "../../../../infrastructure/common/db/create-db-module";
import {RedisRepository} from "../../../../infrastructure/repositories/redis";
import {IRedisRepository, RedisPrefixes} from "../../../repositories/redis";
import {IRedisService} from "../interfaces";
import {RedisService} from "../index";


describe('RedisRepository', () => {
    let redisRepository: IRedisRepository
    let redisService: IRedisService
    let module: TestingModule

    beforeAll( async () => {
        module = await createDbTestingModule();
        redisRepository = module.get<IRedisRepository>(RedisRepository)
        redisService = module.get<IRedisService>(RedisService)
    })

    beforeEach(async () => {
        await redisRepository.clear()
    })

    afterAll( async () => {
        await clearRepos(module)
        await module.close()
    })

    describe('RedisService tests', () => {
        const redisTestKey = '0392039'
        const redisTestValue = JSON.stringify([{ id: redisTestKey, data: 'BTC' }])
        const redisTestExpiry = 1

        it('should set and get value from Redis', async () => {
            await redisService.setWithPrefix(RedisPrefixes.PARCEL, redisTestKey, redisTestValue);
            const value = await redisRepository.get(RedisPrefixes.PARCEL, redisTestKey);
            expect(value).toBe(redisTestValue);
        });

        it('should set value with expiry and get it from Redis', async () => {
            await redisService.setWithExpiryAndPrefix(RedisPrefixes.PARCEL, redisTestKey, redisTestValue, redisTestExpiry);
            const value = await redisRepository.get(RedisPrefixes.PARCEL, redisTestKey);
            expect(value).toBe(redisTestValue);
        });

        it('should set value with expiry and get it from Redis and failed after expiry will finish', async () => {
            await redisService.setWithExpiryAndPrefix(RedisPrefixes.PARCEL, redisTestKey, redisTestValue, redisTestExpiry);
            await new Promise(resolve => setTimeout(resolve, redisTestExpiry + 1000));
            const value = await redisRepository.get(RedisPrefixes.PARCEL, redisTestKey);
            expect(value).toBeNull();
        });

        it('should set value with NX option and get it from Redis', async () => {
            const result = await redisService.setAtomicOperation(RedisPrefixes.PARCEL, redisTestKey, redisTestValue, redisTestExpiry);
            expect(result).toBe(true);
            const value = await redisRepository.get(RedisPrefixes.PARCEL, redisTestKey);
            expect(value).toBe(redisTestValue);
        });

        it('should delete value from Redis', async () => {
            await redisService.setWithPrefix(RedisPrefixes.PARCEL, redisTestKey, redisTestValue);
            await redisService.deleteWithPrefix(RedisPrefixes.PARCEL, redisTestKey);
            const value = await redisRepository.get(RedisPrefixes.PARCEL, redisTestKey);
            expect(value).toBeNull();
        });

        it('should clear Redis', async () => {
            await redisService.setWithPrefix(RedisPrefixes.PARCEL, redisTestKey, redisTestValue);
            await redisRepository.clear();
            const value = await redisRepository.get(RedisPrefixes.PARCEL, redisTestKey);
            expect(value).toBeNull();
        });
    })
})
