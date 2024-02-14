import {Inject, OnModuleDestroy} from "@nestjs/common";
import {IRedisRepository, RedisPrefixes} from "../../../core/repositories/redis";
import Redis from "ioredis";


export class RedisRepository implements OnModuleDestroy, IRedisRepository {

    constructor(@Inject('RedisClient') private readonly redisClient: Redis) {
    }

    onModuleDestroy(): any {
        this.redisClient.disconnect()
    }

    async get(prefix: RedisPrefixes, key: string): Promise<string | null> {
        return this.redisClient.get(`${prefix}:${key}`);
    }

    async set(prefix: RedisPrefixes, key: string, value: string): Promise<void> {
        await this.redisClient.set(`${prefix}:${key}`, value)
    }

    async delete(prefix: RedisPrefixes, key: string): Promise<void> {
        await this.redisClient.del(`${prefix}:${key}`);
    }

    async setWithExpiry(prefix: RedisPrefixes, key: string, value: string, expiry: number): Promise<void> {
        await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry)
    }
    async setNx(prefix: RedisPrefixes, key: string, value: string, expiry: number): Promise<string> {
        return this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry, 'NX');

    }
    async clear(): Promise<void> {
        this.redisClient.flushdb()
    }


}
