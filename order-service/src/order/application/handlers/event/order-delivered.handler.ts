import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { OrderProjectionRepository } from 'src/order/infrastructure/repository/order/order-projection.repository';
import { OrderDeliveredEvent } from 'src/order/domain/event/order/order-delivered.event';
import { OrderStatus } from 'src/order/domain/order/order';

@EventsHandler(OrderDeliveredEvent)
export class OrderDeliveredHandler implements IEventHandler<OrderDeliveredEvent> {
    constructor(
        @Inject(OrderProjectionRepository) private orderProjectionRepository: OrderProjectionRepository,
        private readonly logger: Logger
    ) {}

    async handle(event: OrderDeliveredEvent): Promise<void> {
        const projectionData = {
            id: event.orderId,
            status: OrderStatus.Delivered,
            deliveredAt: event.deliveredAt,
        };
        await this.orderProjectionRepository.insertOne(projectionData);
        this.logger.log(`Order delivered: ${event.orderId}`);
    }
}
