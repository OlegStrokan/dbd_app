import {Injectable} from '@nestjs/common';
import { ICreateParcelDeliveryUseCase } from "./interfaces";
import { ParcelDeliveryEntity } from "../../../infrastructure/entities/parcel-delivery";
import {IParcelDeliveryRepository} from "../../repositories/parcel-delivery";
import {InjectRepository} from "@nestjs/typeorm";
import {ParcelDeliveryRepository} from "../../../infrastructure/repositories/parcel-delivery";
import {CreateParcelDeliveryDto} from "./dto/create-parcel-delivery.dto";

@Injectable()
export class CreateParcelDeliveryUseCase implements ICreateParcelDeliveryUseCase {

  constructor(
      @InjectRepository(ParcelDeliveryRepository)
      public readonly parcelDeliveryRepository: IParcelDeliveryRepository,
  ) {}

  async create(dto: CreateParcelDeliveryDto): Promise<ParcelDeliveryEntity> {
    return this.parcelDeliveryRepository.upsertOne(dto);
  }

}
