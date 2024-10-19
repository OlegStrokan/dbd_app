import { IEvent } from '@nestjs/cqrs';

export class OrderCreatedEvent implements IEvent {
    constructor(public readonly orderId: string, public readonly customerId: string, public readonly totalAmount: number) {}
}
