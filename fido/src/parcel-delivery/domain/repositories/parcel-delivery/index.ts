import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateParcelDeliveryInput } from "../../../app/use-cases/create-parcel-delivery/dto/create-parcel-delivery.input";
import { IParcelDeliveryRepository } from "../../../app/repositories/parcel-delivery";
import { ParcelDeliveryEntity } from "../../entities/parcel-delivery";

@Injectable()
export class ParcelDeliveryRepository implements IParcelDeliveryRepository {
  constructor(
    @InjectRepository(ParcelDeliveryEntity)
    private readonly repository: Repository<ParcelDeliveryEntity>,
  ) {}

  async create(dto: CreateParcelDeliveryInput): Promise<ParcelDeliveryEntity> {
    const parcelDelivery = this.repository.create(dto);
    return await this.repository.save(parcelDelivery)
  }

  async findOneById(id: ParcelDeliveryEntity['id']) {
    return await this.repository.findOneBy({ id })
  }

  async findAll() {
    return await this.repository.find()
  }
}
