import { IEvent } from '@nestjs/cqrs';

export class OrderDeliveredEvent implements IEvent {
    constructor(
        public readonly orderId: string,
        public readonly deliveredAt: Date,
        public readonly deliveryAddress: string
    ) {}
}
