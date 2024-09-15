import { RedisRepository } from "@app/services/redis/infrastructure/repository";
import {
  IRedisRepository,
  RedisPrefixes,
} from "@app/services/redis/repository";
import { IGetParcelDeliveryUseCase } from "./interfaces";
import { ParcelDelivery } from "@app/parcel-delivery/entity";
import { ParcelDeliveryRepository } from "@app/parcel-delivery/infrastructure/repository/parcel-delivery";
import { IParcelDeliveryRepository } from "@app/parcel-delivery/repository";
import { Injectable, Inject } from "@nestjs/common";
import { ParcelDeliveryNotFoundError } from "./error";

@Injectable()
export class GetParcelDeliveryUseCase implements IGetParcelDeliveryUseCase {
  constructor(
    @Inject(ParcelDeliveryRepository)
    public readonly parcelDeliveryRepository: IParcelDeliveryRepository,
    @Inject(RedisRepository)
    public readonly redisRepository: IRedisRepository
  ) {}

  async getOne(id: string): Promise<ParcelDelivery> {
    const cachedParcel = await this.redisRepository.setAtomicOperation(
      RedisPrefixes.PARCEL,
      id,
      "1",
      3000
    );
    if (!cachedParcel) {
      const cachedParcel = await this.redisRepository.get(
        RedisPrefixes.PARCEL,
        id
      );
      return JSON.parse(cachedParcel);
    }
    const foundParcel = await this.parcelDeliveryRepository.findOneById(id);

    if (!foundParcel) {
      throw new ParcelDeliveryNotFoundError(
        "Parcel delivery with current id doesn't exist",
        { parcelDeliveryId: id }
      );
    }

    await this.redisRepository.setWithExpiry(
      RedisPrefixes.PARCEL,
      id,
      JSON.stringify(foundParcel),
      3000
    );
    return foundParcel;
  }
}
