import { OrderData } from './order';

export interface IOrderCommandRepository {
    insertOne(order: OrderData): Promise<void>;
    updateOne(order: OrderData): Promise<void>;
    deleteOne(orderId: string): Promise<void>;
}
