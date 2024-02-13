import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ParcelDeliveryRepository} from "../../../infrastructure/repositories/parcel-delivery";
import {IParcelDeliveryRepository} from "../../repositories/parcel-delivery";
import {ParcelDeliveryEntity} from "../../../infrastructure/entities/parcel-delivery";
import {IGetParcelDeliveryUseCase} from "./interfaces";
import {RedisRepository} from "../../../infrastructure/repositories/redis";
import {IRedisRepository, RedisPrefixes} from "../../repositories/redis";
import {IRedisService} from "../../services/redis/interfaces";

@Injectable()
export class GetParcelDeliveryUseCase implements IGetParcelDeliveryUseCase {

    constructor(
        @InjectRepository(ParcelDeliveryRepository)
        public readonly parcelDeliveryRepository: IParcelDeliveryRepository,
        public readonly redisService: IRedisService
    ) {}

    async getOne(id: string): Promise<ParcelDeliveryEntity> {

        const cachedParcel = await this.redisService.getWithPrefix(RedisPrefixes.PARCEL, id)

        if  (cachedParcel) return JSON.parse(cachedParcel)

        const foundParcel =  await this.parcelDeliveryRepository.findOneById(id)
        if (foundParcel) await this.redisService.setWithExpiryAndPrefix(RedisPrefixes.PARCEL, foundParcel.id, JSON.stringify(foundParcel), 3000 )

        return foundParcel

    }
}
