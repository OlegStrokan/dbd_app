import {Inject, Injectable} from '@nestjs/common';
import { IParcelDeliveryUseCase } from "./interfaces";
import { CreateParcelDeliveryInput } from "./dto/create-parcel-delivery.input";
import { ParcelDeliveryEntity } from "../../../infrastructure/entities/parcel-delivery";
import {IParcelDeliveryRepository} from "../../repositories/parcel-delivery";
import {getRepositoryToken, InjectRepository} from "@nestjs/typeorm";
import {ParcelDeliveryRepository} from "../../../infrastructure/repositories/parcel-delivery";

@Injectable()
export class ParcelDeliveryUseCase implements IParcelDeliveryUseCase {

  constructor(
      @InjectRepository(ParcelDeliveryRepository)
      public readonly parcelDeliveryRepository: IParcelDeliveryRepository,
  ) {}

  async create(dto: CreateParcelDeliveryInput): Promise<ParcelDeliveryEntity> {
    return this.parcelDeliveryRepository.upsertOne(dto);
  }

  async getOne(id: number): Promise<ParcelDeliveryEntity> {
   return await this.parcelDeliveryRepository.findOneById(id)


  }
}
