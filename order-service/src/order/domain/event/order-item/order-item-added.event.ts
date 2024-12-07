import { IEvent } from '@nestjs/cqrs';

export class OrderItemAddedEvent implements IEvent {
    constructor(
        public readonly id: string,
        public readonly productId: string,
        public readonly quantity: number,
        public readonly price: number,
        public readonly weight: number
    ) {}
}
