import { OrderItem } from './order-item';

export interface IOrderItemQueryRepository {
    find(): Promise<OrderItem[]>;
    findById(orderId: string): Promise<OrderItem>;
}
