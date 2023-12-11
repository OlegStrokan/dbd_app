import { Injectable } from '@nestjs/common';
import { IParcelDelivery } from "./interfaces";
import { CreateParcelDeliveryInput } from "./dto/create-parcel-delivery.input";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ParcelDeliveryEntity } from "../../../domain/entities/parcel-delivery";

@Injectable()
export class ParcelDeliveryService implements IParcelDelivery {

  constructor(
    @InjectRepository(ParcelDeliveryEntity)
    public readonly parcelDeliveryRepository: Repository<ParcelDeliveryEntity>,
  ) {}

  async create(dto: CreateParcelDeliveryInput) {
    const newParcelDelivery = this.parcelDeliveryRepository.create(dto);
    return await this.parcelDeliveryRepository.save(newParcelDelivery);
  }
}
