import { CreateOrderItemCommand } from '../order-item/create-order-item.command';

export class CreateOrderCommand {
    constructor(
        public readonly customerId: string,
        public readonly totalAmount: number,
        public readonly specialInstructions: string,
        public readonly paymentMethod: string,
        public readonly deliveryAddress: string,
        public readonly orderItems: CreateOrderItemCommand[]
    ) {}
}
