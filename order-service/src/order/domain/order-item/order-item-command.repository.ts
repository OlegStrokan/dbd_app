import { OrderItemEssentialProperties } from './order-item.interface';

export interface IOrderItemCommandRepository {
    insertOne(order: OrderItemEssentialProperties): Promise<void>;
    insertMany(order: OrderItemEssentialProperties[]): Promise<void>;
    updateOne(order: OrderItemEssentialProperties): Promise<void>;
    deleteOne(order: string): Promise<void>;
}
