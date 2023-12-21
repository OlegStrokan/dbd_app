import { Injectable } from '@nestjs/common';
import { IParcelDelivery } from "./interfaces";
import { CreateParcelDeliveryInput } from "./dto/create-parcel-delivery.input";
import { ParcelDeliveryEntity } from "../../../infrastructure/entities/parcel-delivery";
import {IParcelDeliveryRepository} from "../../repositories/parcel-delivery";
import {InjectRepository} from "@nestjs/typeorm";
import {ParcelDeliveryRepository} from "../../../infrastructure/repositories/parcel-delivery";

@Injectable()
export class ParcelDeliveryService implements IParcelDelivery {

  constructor(
      @InjectRepository(ParcelDeliveryRepository)
      public readonly parcelDeliveryRepository: IParcelDeliveryRepository,
  ) {}

  async create(dto: CreateParcelDeliveryInput): Promise<ParcelDeliveryEntity> {
    return this.parcelDeliveryRepository.upsertOne(dto);
  }

  async getOne(id: number): Promise<ParcelDeliveryEntity> {
    const parcelDelivery = await this.parcelDeliveryRepository.findOneById(id)

    if (!parcelDelivery) {
      throw new Error('Parcel delivery with current id doesn\'t exist')
    }

    return parcelDelivery;

  }
}
