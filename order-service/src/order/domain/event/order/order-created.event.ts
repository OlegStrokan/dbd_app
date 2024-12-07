import { IEvent } from '@nestjs/cqrs';
import { OrderItemAddedEvent } from '../order-item/order-item-added.event';

export class OrderCreatedEvent implements IEvent {
    constructor(
        public id: string,
        public readonly customerId: string,
        public readonly totalAmount: number,
        public readonly specialInstructions: string,
        public readonly paymentMethod: string,
        public readonly deliveryAddress: string,
        public readonly orderItems: OrderItemAddedEvent[]
    ) {}
}
