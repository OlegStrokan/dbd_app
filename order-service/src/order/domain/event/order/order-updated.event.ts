import { IEvent } from '@nestjs/cqrs';

export class OrderUpdatedEvent implements IEvent {
    constructor(
        public readonly orderId: string,
        public readonly specialInstructions: string,
        public readonly paymentMethod: string,
        public readonly deliveryAddress: string
    ) {}
}
