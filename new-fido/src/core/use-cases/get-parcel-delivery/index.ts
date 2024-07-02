import { Inject, Injectable } from "@nestjs/common";
import { IParcelDeliveryRepository } from "../../repositories/parcel-delivery";
import { IGetParcelDeliveryUseCase } from "./interfaces";
import { RedisPrefixes } from "../../repositories/redis";
import { IRedisService } from "../../services/redis/interfaces";
import { RedisService } from "../../services/redis";
import { ParcelDeliveryRepository } from "../../../infrastructure/repositories/parcel-delivery";
import { ParcelDeliveryNotFoundError } from "./error";
import { ParcelDelivery } from "@app/core/entities/parcel-delivery";
import { ParcelDeliveryMapper } from "@app/interfaces/parcel-delivery/mappers";
import { IMapper } from "@app/interfaces/types/mapper";
import { ParcelDeliveryEntity } from "@app/infrastructure/entities/parcel-delivery";
import { ParcelDeliveryGQL } from "@app/interfaces/parcel-delivery/response-type";

@Injectable()
export class GetParcelDeliveryUseCase implements IGetParcelDeliveryUseCase {
  constructor(
    @Inject(ParcelDeliveryRepository)
    public readonly parcelDeliveryRepository: IParcelDeliveryRepository,
    @Inject(RedisService)
    public readonly redisService: IRedisService
  ) {}

  async getOne(id: string): Promise<ParcelDelivery> {
    const cachedParcel = await this.redisService.setAtomicOperation(
      RedisPrefixes.PARCEL,
      id,
      "1",
      3000
    );
    if (!cachedParcel) {
      const cachedParcel = await this.redisService.getWithPrefix(
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

    await this.redisService.setWithExpiryAndPrefix(
      RedisPrefixes.PARCEL,
      id,
      JSON.stringify(foundParcel),
      3000
    );
    return foundParcel;
  }
}
