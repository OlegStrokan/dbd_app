import { OrderStatus } from 'src/order/domain/order/order';

export class OrderStatusMapper {
    static fromDatabase(status: string): OrderStatus {
        switch (status) {
            case 'Created':
                return OrderStatus.Created;
            case 'Completed':
                return OrderStatus.Completed;
            case 'Canceled':
                return OrderStatus.Canceled;
            case 'Shipped':
                return OrderStatus.Shipped;
            case 'Pending':
                return OrderStatus.Pending;
            default:
                throw new Error(`Unknown order status: ${status}`);
        }
    }
}
