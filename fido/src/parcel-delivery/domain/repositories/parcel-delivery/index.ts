import { Injectable } from "@nestjs/common";
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {EntityManager, Repository} from "typeorm";
import { CreateParcelDeliveryInput } from "../../../app/use-cases/create-parcel-delivery/dto/create-parcel-delivery.input";
import { IParcelDeliveryRepository } from "../../../app/repositories/parcel-delivery";
import { ParcelDeliveryEntity } from "../../entities/parcel-delivery";

@Injectable()
export class ParcelDeliveryRepository implements IParcelDeliveryRepository {
  constructor(
    @InjectRepository(ParcelDeliveryEntity)
    private readonly repository: Repository<ParcelDeliveryEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,

  ) {}

  async upsertOne(dto: CreateParcelDeliveryInput): Promise<ParcelDeliveryEntity> {
    const parcelDelivery = this.repository.create(dto);
    return await this.repository.save(parcelDelivery)
  }

  async upsertMany(dto: CreateParcelDeliveryInput[]): Promise<ParcelDeliveryEntity[]> {
    return await this.entityManager.transaction(async (transactionManager) => {
      const parcelDeliveries = dto.map((parcel) =>
          transactionManager.create(ParcelDeliveryEntity, parcel) as ParcelDeliveryEntity
      );
      return await Promise.all(parcelDeliveries.map((parcel) => transactionManager.save(parcel)));
    });
  }


  async findOneById(id: ParcelDeliveryEntity['id']): Promise<ParcelDeliveryEntity> {
    return await this.repository.findOneBy({ id })
  }

  async findAll(): Promise<ParcelDeliveryEntity[]> {
    return await this.repository.find()
  }

  async deleteAll(): Promise<void> {
     await this.repository.delete({});
  }
}

