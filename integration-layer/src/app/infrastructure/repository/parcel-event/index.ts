import { IParcelRepository } from "../../../core/repository/parcel-event/index";
import { ParcelEvent } from "../../entity/parcel-event";

// TODO - fuck it
export class ParcelEventRepository implements IParcelRepository {
  createOne(data: any) {
    const parcelEvent = new ParcelEvent(data);
    return parcelEvent;
  }
}
