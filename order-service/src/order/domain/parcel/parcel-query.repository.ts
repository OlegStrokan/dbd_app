import { OrderItem } from '../order-item/order-item';
import { Order } from '../order/order';
import { Parcel } from '../parcel/parcel';

export interface IParcelQueryRepository {
    find(): Promise<Parcel[]>;
    findById(parcelId: string): Promise<Parcel>;
    insertMany(order: Order): Promise<void>;
    insertOne(parcel: Parcel, item: OrderItem): Promise<void>;
    updateOne(parcelId: string, parcel: Partial<Parcel>): Promise<void>;
    deleteOne(parcelId: string): Promise<void>;
}
