import { CreateParcelDeliveryInput } from "../../../interfaces/parcel-delivery/request-type/create-parcel-delivery.input";
import { ParcelDeliveryEntity } from "../../../infrastructure/entities/parcel-delivery";
import {IParcelDelivery} from "../../entities";

export interface IParcelDeliveryRepository {
  upsertOne(dto: CreateParcelDeliveryInput): Promise<ParcelDeliveryEntity>;
  upsertMany(dtos: CreateParcelDeliveryInput[]): Promise<ParcelDeliveryEntity[]>;
  findOneById(id: ParcelDeliveryEntity['id']): Promise<ParcelDeliveryEntity>
  findAll(): Promise<ParcelDeliveryEntity[]>
  deleteAll(): Promise<void>
}
