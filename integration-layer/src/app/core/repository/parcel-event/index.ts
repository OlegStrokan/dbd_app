import { ParcelEventCreateOneDto } from "@root/src/app/interface/dtos/parcel-event/create-one";
import { ParcelEvent } from "../../../infrastructure/entity/parcel-event";

export interface IParcelRepository {
  createOne(data: ParcelEventCreateOneDto): ParcelEvent;
}
