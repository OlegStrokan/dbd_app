import { CreateParcelDeliveryInput } from "../../../interfaces/parcel-delivery/request-type/create-parcel-delivery.input";
import { ParcelDeliveryEntity } from "../../../infrastructure/entities/parcel-delivery";
import {IParcelDelivery} from "../../entities/parcel-delivery";
import {IClearableRepository} from "../clearable";

export interface IParcelDeliveryRepository extends IClearableRepository {
  upsertOne(dto: CreateParcelDeliveryInput): Promise<ParcelDeliveryEntity>;
  upsertMany(dtos: CreateParcelDeliveryInput[]): Promise<ParcelDeliveryEntity[]>;
  findOneById(id: ParcelDeliveryEntity['id']): Promise<ParcelDeliveryEntity>
  findByParcelNumber(id: ParcelDeliveryEntity['parcelNumber']): Promise<ParcelDeliveryEntity>
  findAll(): Promise<ParcelDeliveryEntity[]>
}
