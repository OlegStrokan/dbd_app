import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { OrderProjectionRepository } from 'src/order/infrastructure/repository/order/order-projection.repository';
import { OrderUpdatedEvent } from 'src/order/domain/event/order/order-updated.event';

@EventsHandler(OrderUpdatedEvent)
export class OrderDeliveredHandler implements IEventHandler<OrderUpdatedEvent> {
    constructor(
        @Inject(OrderProjectionRepository) private orderProjectionRepository: OrderProjectionRepository,
        private readonly logger: Logger
    ) {}

    async handle(event: OrderUpdatedEvent): Promise<void> {
        const projectionData = {
            ...event,
        };
        await this.orderProjectionRepository.insertOne(projectionData);
        this.logger.log(`Order updated: ${event.orderId}`);
    }
}
