import { Injectable } from "@nestjs/common";
import {IRedisRepository, RedisPrefixes} from "../../../core/repositories/redis";

@Injectable()
export class RedisService {
    constructor(private readonly redisRepository: IRedisRepository) {}

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
        console.log('Method not implemented, but you can use it');
        return Promise.resolve();
    }
}
