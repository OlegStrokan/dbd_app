import { IEvent } from '@nestjs/cqrs';

export class OrderCompletedEvent implements IEvent {
    constructor(public readonly orderId: string, public readonly customerId: string) {}
}
