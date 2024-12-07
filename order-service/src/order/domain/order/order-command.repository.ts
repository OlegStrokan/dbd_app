import { Order } from './order';

export interface IOrderCommandRepository {
    insertOne(order: Order): Promise<void>;
    updateOne(order: Order): Promise<void>;
    deleteOne(order: Order): Promise<void>;
}
