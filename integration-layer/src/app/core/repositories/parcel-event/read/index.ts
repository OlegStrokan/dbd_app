import {IParcelEventRead} from "../../../entities/parcel-event";
import {ScrollParams} from "../../../types/pagination";

export interface IParcelEventReadParam {
    parcelNumbers?: IParcelEventRead['parcelNumber'][]
}

export interface IParcelEventReadRepository {
    getManyByParams(
        params: IParcelEventReadParam,
        scrollParams: ScrollParams): Promise<IParcelEventRead[]>
}
