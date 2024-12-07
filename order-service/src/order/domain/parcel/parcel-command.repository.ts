import { OrderItem } from '../order-item/order-item';
import { Order } from '../order/order';
import { Parcel } from './parcel';

export interface IParcelCommandRepository {
    insertMany(order: Order): Promise<void>;
    insertOne(parcel: Parcel, item: OrderItem): Promise<void>;
    updateOne(parcel: Parcel): Promise<void>;
    deleteOne(parcelId: string): Promise<void>;
}
