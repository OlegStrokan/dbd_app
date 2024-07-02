import { Inject, Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { IParcelDeliveryRepository } from "../../../core/repositories/parcel-delivery";
import { ParcelDeliveryEntity } from "../../entities/parcel-delivery";
import { CreateParcelDeliveryDto } from "../../../core/use-cases/create-parcel-delivery/dto/create-parcel-delivery.dto";
import { ParcelDelivery } from "../../../core/entities/parcel-delivery";
import { ParcelDeliveryMapper } from "@app/interfaces/parcel-delivery/mappers";
import { ParcelDeliveryGQL } from "@app/interfaces/parcel-delivery/response-type";
import { IMapper } from "@app/interfaces/types/mapper";

@Injectable()
export class ParcelDeliveryRepository implements IParcelDeliveryRepository {
  constructor(
    @InjectRepository(ParcelDeliveryEntity)
    private readonly repository: Repository<ParcelDeliveryEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @Inject(ParcelDeliveryMapper)
    public readonly mapper: IMapper<
      ParcelDeliveryGQL,
      ParcelDelivery,
      ParcelDeliveryEntity
    >
  ) {}

  async upsertOne(dto: CreateParcelDeliveryDto): Promise<ParcelDelivery> {
    const parcel = ParcelDelivery.create(dto);
    const parcelDelivery = this.repository.create(parcel.data);
    const savedParcelDelivery = await this.repository.save(parcelDelivery);
    return this.mapper.toCoreEntity(savedParcelDelivery);
  }

  async upsertMany(dto: CreateParcelDeliveryDto[]): Promise<ParcelDelivery[]> {
    const updatedParcels = await this.entityManager.transaction(
      async (transactionManager) => {
        try {
          const parcelDeliveries = dto.map(
            (parcel) =>
              transactionManager.create(
                ParcelDeliveryEntity,
                parcel
              ) as ParcelDeliveryEntity
          );
          return await Promise.all(
            parcelDeliveries.map((parcel) => transactionManager.save(parcel))
          );
        } catch (e) {
          console.log(e);
          throw new Error(e);
        }
      }
    );

    return updatedParcels.map(this.mapper.toCoreEntity);
  }

  async findOneById(
    id: ParcelDeliveryEntity["id"]
  ): Promise<ParcelDelivery | null> {
    const parcel = await this.repository.findOneBy({ id });
    return this.mapper.toCoreEntity(parcel);
  }

  async findByParcelNumber(
    parcelNumber: ParcelDeliveryEntity["parcelNumber"]
  ): Promise<ParcelDelivery | null> {
    const parcel = await this.repository.findOneBy({ parcelNumber });
    return this.mapper.toCoreEntity(parcel);
  }

  async findAll(): Promise<ParcelDelivery[]> {
    const parcels = await this.repository.find();
    return parcels.map(this.mapper.toCoreEntity);
  }

  public async clear(): Promise<void> {
    await this.repository.clear();
  }
}
