import {RedisPrefixes} from "../../repositories/redis";

export interface IRedisService {
    getWithPrefix(prefix: RedisPrefixes, key: string): Promise<string | null>;
    setWithPrefix(prefix: RedisPrefixes, key: string, value: string): Promise<void>;
    setAtomicOperation(prefix: RedisPrefixes, key: string, value: string, expiry: number): Promise<boolean>;
    deleteWithPrefix(prefix: RedisPrefixes, key: string): Promise<void>;
    setWithExpiryAndPrefix(prefix: RedisPrefixes, key: string, value: string, expiry: number): Promise<void>;
    clear(): Promise<void>;
}
