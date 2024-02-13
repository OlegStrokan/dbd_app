import {IClearableRepository} from "../clearable";


export enum RedisPrefixes {
    PARCEL = "PARCEL"
}
export interface IRedisRepository extends IClearableRepository {
    get(prefix: RedisPrefixes, key: string): Promise<string | null>,
    set(prefix: RedisPrefixes, key: string, value: string): Promise<void>,
    delete(prefix: RedisPrefixes, key: string): Promise<void>,
    setWithExpiry(prefix: RedisPrefixes, key: string, value: string, expiry: number): Promise<void>
}
