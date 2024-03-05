import { IParcelEventRead } from "../../../../../core/entities/parcel-event";
import {ParcelEventEntity} from "../../../../entities/parcel-event";
export const toCoreParcelEvent = (parcelTypeOrmEntity: ParcelEventEntity): IParcelEventRead => {
    return {
        guid: parcelTypeOrmEntity.id.toString(),
        parcelNumber: 'not yet implemented',
        seq: 'not yet implemented'
    }
}
