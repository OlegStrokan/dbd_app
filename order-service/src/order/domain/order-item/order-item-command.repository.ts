import { OrderItem } from './order-item';

export interface IOrderItemCommandRepository {
    insertOne(order: OrderItem): Promise<void>;
    insertMany(order: OrderItem[]): Promise<void>;
    updateOne(order: OrderItem): Promise<void>;
    deleteOne(order: string): Promise<void>;
}
