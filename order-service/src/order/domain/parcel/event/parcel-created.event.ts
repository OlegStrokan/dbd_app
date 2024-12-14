// events/parcel-created.event.ts
import { IEvent } from '@nestjs/cqrs';

export class ParcelCreatedEvent implements IEvent {
    constructor(public readonly id: string, public readonly orderId: string, public readonly shippingCostId: string) {}
}
