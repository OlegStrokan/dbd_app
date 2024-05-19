import {FactoryProvider} from "@nestjs/common";
import Redis from "ioredis";

export const redisClientFactory: FactoryProvider<Redis> = {
    provide: 'RedisClient',
    useFactory: () => {
        const redisInstance = new Redis({
            host: 'localhost', // process.env.REDIS_HOST,
            port:  6379, //  +process.env.REDIS_PORT
            password: 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81',
        })

        redisInstance.on('error', (e) => {
            throw new Error(`Redis connection failed: ${e}`)
        })
        return redisInstance;
    },
    inject: [],
}

