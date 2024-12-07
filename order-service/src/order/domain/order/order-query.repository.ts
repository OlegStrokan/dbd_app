import { Order } from './order';

export interface IOrderQueryRepository {
    find(): Promise<Order>;
    findById(orderId: string): Promise<Order>;
}
