import {Inject, Injectable} from '@nestjs/common';
import { ICreateParcelDeliveryUseCase } from "./interfaces";
import { ParcelDeliveryEntity } from "../../../infrastructure/entities/parcel-delivery";
import {IParcelDeliveryRepository} from "../../repositories/parcel-delivery";
import {CreateParcelDeliveryDto} from "./dto/create-parcel-delivery.dto";
import {ParcelDeliveryRepository} from "../../../infrastructure/repositories/parcel-delivery";

@Injectable()
export class CreateParcelDeliveryUseCase implements ICreateParcelDeliveryUseCase {

  constructor(
      @Inject(ParcelDeliveryRepository) public readonly parcelDeliveryRepository: IParcelDeliveryRepository,
  ) {}

  async create(dto: CreateParcelDeliveryDto): Promise<ParcelDeliveryEntity> {
    const foundParcel = this.parcelDeliveryRepository.findByParcelNumber(dto.parcelNumber)


    if (foundParcel) {
      throw new Error('Parcel with current parcel number already exist ')
    }

    return await this.parcelDeliveryRepository.upsertOne(dto);
  }




}
