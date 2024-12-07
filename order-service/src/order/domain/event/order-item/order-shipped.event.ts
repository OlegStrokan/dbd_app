import { IEvent } from '@nestjs/cqrs';

export class OrderShippedEvent implements IEvent {
    constructor(
        public readonly orderId: string,
        public readonly trackingNumber: string,
        public readonly deliveryDate: Date
    ) {}
}
