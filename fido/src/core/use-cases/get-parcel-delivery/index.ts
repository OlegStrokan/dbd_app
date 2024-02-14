import {Inject, Injectable} from "@nestjs/common";
import {IParcelDeliveryRepository} from "../../repositories/parcel-delivery";
import {ParcelDeliveryEntity} from "../../../infrastructure/entities/parcel-delivery";
import {IGetParcelDeliveryUseCase} from "./interfaces";
import {RedisPrefixes} from "../../repositories/redis";
import {IRedisService} from "../../services/redis/interfaces";
import {RedisService} from "../../services/redis";
import {ParcelDeliveryRepository} from "../../../infrastructure/repositories/parcel-delivery";

@Injectable()
export class GetParcelDeliveryUseCase implements IGetParcelDeliveryUseCase {

    constructor(
        @Inject(ParcelDeliveryRepository) public readonly parcelDeliveryRepository: IParcelDeliveryRepository,
        @Inject(RedisService) public readonly redisService: IRedisService
    ) {}

    async getOne(id: string): Promise<ParcelDeliveryEntity> {

        const cachedParcel = await this.redisService.setAtomicOperation(RedisPrefixes.PARCEL, id, "1", 3000);
        if (!cachedParcel) {
            const cachedParcel = await this.redisService.getWithPrefix(RedisPrefixes.PARCEL, id);
            return JSON.parse(cachedParcel);
        }
        const foundParcel = await this.parcelDeliveryRepository.findOneById(id);

        if (foundParcel) {
            await this.redisService.setWithExpiryAndPrefix(RedisPrefixes.PARCEL, id, JSON.stringify(foundParcel), 3000);
        }

        return foundParcel;

    }
}
