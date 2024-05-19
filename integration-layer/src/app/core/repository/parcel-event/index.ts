import { ParcelEvent } from "../../../infrastructure/entity/parcel-event";

// TODO - update THISSSSS
export interface IParcelRepository {
  createOne(data: any): ParcelEvent;
}
