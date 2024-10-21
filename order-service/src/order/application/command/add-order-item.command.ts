import { OrderItem } from 'src/order/domain/order-item/order-item';

export class AddOrderItemCommand {
    constructor(public readonly orderId: string, public readonly item: OrderItem) {}
}
