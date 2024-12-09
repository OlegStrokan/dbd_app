import { CreateOrderItemCommand } from '../order-item/create-order-item.command';

export class CreateOrderCommand {
    constructor(
        public readonly customerId: string,
        public readonly totalAmount: number,
        public readonly orderItems?: CreateOrderItemCommand[]
    ) {}
}
