import { IEvent } from '@nestjs/cqrs';

export class OrderCancelledEvent implements IEvent {
    constructor(public readonly orderId: string, public readonly canceledAt: Date) {}
}
