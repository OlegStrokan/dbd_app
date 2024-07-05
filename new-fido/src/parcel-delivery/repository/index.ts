import { CreateParcelDeliveryInput } from "../resolver/request-type";
import { ParcelDeliveryEntity } from "../infrastructure/entity/parcel-delivery";
import { IParcelDelivery, ParcelDelivery } from "../entity";
import { IClearableRepository } from "../../shared/interfaces/types/clearable";

export interface IParcelDeliveryRepository extends IClearableRepository {
  upsertOne(dto: CreateParcelDeliveryInput): Promise<ParcelDelivery>;
  upsertMany(dtos: CreateParcelDeliveryInput[]): Promise<ParcelDelivery[]>;
  findOneById(id: ParcelDeliveryEntity["id"]): Promise<ParcelDelivery | null>;
  findByParcelNumber(
    id: ParcelDeliveryEntity["parcelNumber"]
  ): Promise<ParcelDelivery | null>;
  findAll(): Promise<ParcelDelivery[]>;
}
