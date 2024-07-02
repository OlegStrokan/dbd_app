import { CreateParcelDeliveryInput } from "../../../interfaces/parcel-delivery/request-type";
import { ParcelDeliveryEntity } from "../../../infrastructure/entities/parcel-delivery";
import {
  IParcelDelivery,
  ParcelDelivery,
} from "../../entities/parcel-delivery";
import { IClearableRepository } from "../clearable";

export interface IParcelDeliveryRepository extends IClearableRepository {
  upsertOne(dto: CreateParcelDeliveryInput): Promise<ParcelDelivery>;
  upsertMany(dtos: CreateParcelDeliveryInput[]): Promise<ParcelDelivery[]>;
  findOneById(id: ParcelDeliveryEntity["id"]): Promise<ParcelDelivery | null>;
  findByParcelNumber(
    id: ParcelDeliveryEntity["parcelNumber"]
  ): Promise<ParcelDelivery | null>;
  findAll(): Promise<ParcelDelivery[]>;
}
