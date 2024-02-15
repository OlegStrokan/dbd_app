import {Inject, Injectable} from "@nestjs/common";
import {IRedisRepository, RedisPrefixes} from "../../../core/repositories/redis";
import {IRedisService} from "./interfaces";
import * as console from "console";
import {RedisRepository} from "../../../infrastructure/repositories/redis";

@Injectable()
export class RedisService implements IRedisService {
    constructor(@Inject(RedisRepository)public readonly redisRepository: IRedisRepository) {}

    async getWithPrefix(prefix: RedisPrefixes, key: string): Promise<string | null> {
        return this.redisRepository.get(prefix, key);
    }

    async setWithPrefix(prefix: RedisPrefixes, key: string, value: string): Promise<void> {
        await this.redisRepository.set(prefix, key, value);
    }

    async deleteWithPrefix(prefix: RedisPrefixes, key: string): Promise<void> {
        await this.redisRepository.delete(prefix, key);
    }

    async setWithExpiryAndPrefix(prefix: RedisPrefixes, key: string, value: string, expiry: number): Promise<void> {
        await this.redisRepository.setWithExpiry(prefix, key, value, expiry);
    }

    async clear(): Promise<void> {
        await this.redisRepository.clear()
    }

    async setAtomicOperation(prefix: RedisPrefixes, key: string, value: string, expiry: number): Promise<boolean> {
        const result = await this.redisRepository.setNx(prefix, key, value, expiry);
        return result === "OK";
    }
}
