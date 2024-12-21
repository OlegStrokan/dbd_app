import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { OrderItem } from 'src/order/domain/order-item/order-item';
import { OrderProjectionRepository } from 'src/order/infrastructure/repository/order/order-projection.repository';
import { OrderStatus } from 'src/order/domain/order/order';
import { OrderCreatedEvent } from 'src/order/domain/order/event/order-created.event';

@EventsHandler(OrderCreatedEvent)
export class OrderCreatedProjectionHandler implements IEventHandler<OrderCreatedEvent> {
    constructor(
        @Inject(OrderProjectionRepository) private orderProjectionRepository: OrderProjectionRepository,
        private readonly logger: Logger
    ) {}

    async handle(event: OrderCreatedEvent): Promise<void> {
        const orderItems: OrderItem[] = event.items.map((item) => OrderItem.createWithIdAndDate(item));
        const projectionData = {
            id: event.id,
            customerId: event.customerId,
            totalAmount: event.totalAmount,
            createdAt: event.createdAt,
            items: orderItems.map((item) => item.data),
            status: OrderStatus.Created,
        };
        await this.orderProjectionRepository.insertOne(projectionData);
        this.logger.log(`Order projection updated for order ID: ${event.id}`);
    }
}
