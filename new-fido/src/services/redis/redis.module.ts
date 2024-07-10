import { Module } from "@nestjs/common";
import Redis from "ioredis";
import { RedisRepository } from "./infrastructure/repository";

@Module({
  providers: [
    {
      provide: "RedisClient",
      useFactory: () => {
        return new Redis({
          port: 6379,
          host: "10.32.0.18",
          password: "eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81",
        });
      },
    },
    RedisRepository,
  ],
  exports: ["RedisClient", RedisRepository],
})
export class RedisModule {}
