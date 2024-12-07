import { Parcel } from '../parcel/parcel';

export interface IParcelQueryRepository {
    find(): Promise<Parcel[]>;
    findById(parcelId: string): Promise<Parcel>;
}
