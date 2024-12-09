import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { OrderProjectionRepository } from 'src/order/infrastructure/repository/order/order-projection.repository';
import { OrderStatus } from 'src/order/domain/order/order';
import { OrderShippedEvent } from 'src/order/domain/event/order/order-shipped.event';

@EventsHandler(OrderShippedEvent)
export class OrderDeliveredHandler implements IEventHandler<OrderShippedEvent> {
    constructor(
        @Inject(OrderProjectionRepository) private orderProjectionRepository: OrderProjectionRepository,
        private readonly logger: Logger
    ) {}

    async handle(event: OrderShippedEvent): Promise<void> {
        const projectionData = {
            id: event.orderId,
            status: OrderStatus.Shipped,
            shippedAt: event.shippedAt,
            trackingNumber: event.trackingNumber,
            deliveryDate: event.deliveryDate,
        };
        await this.orderProjectionRepository.insertOne(projectionData);
        this.logger.log(`Order delivered: ${event.orderId}`);
    }
}
