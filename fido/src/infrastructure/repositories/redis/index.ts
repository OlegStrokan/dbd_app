import {Inject, OnModuleDestroy} from "@nestjs/common";
import {IRedisRepository} from "../../../core/repositories/redis";
import Redis from "ioredis";


export class RedisRepository implements OnModuleDestroy, IRedisRepository {

    constructor(@Inject('RedisClient') private readonly redisClient: Redis) {
    }

    onModuleDestroy(): any {
        this.redisClient.disconnect()
    }

    async get(prefix: string, key: string): Promise<string | null> {
        return this.redisClient.get(`${prefix}:${key}`);
    }

    async set(prefix: string, key: string, value: string): Promise<void> {
        await this.redisClient.set(`${prefix}:${key}`, value)
    }

    async delete(prefix: string, key: string): Promise<void> {
        await this.redisClient.del(`${prefix}:${key}`);
    }

    async setWithExpiry(prefix: string, key: string, value: string, expiry: number): Promise<void> {
        await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry)
    }

    async clear(): Promise<void> {
        console.log('Method not implemented, but you can use it');
        return Promise.resolve();
    }


}
