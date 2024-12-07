import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { OrderCreatedEvent } from 'src/order/domain/event/order/order-created.event';
import { OrderQueryRepository } from 'src/order/infrastructure/repository/order/order-query.repository';
import { Order } from 'src/order/domain/order/order';
import { OrderItem } from 'src/order/domain/order-item/order-item';

@EventsHandler(OrderCreatedEvent)
export class OrderCreatedHandler implements IEventHandler<OrderCreatedEvent> {
    constructor(@Inject(OrderQueryRepository) private orderQueryRepository: OrderQueryRepository) {}

    async handle(event: OrderCreatedEvent): Promise<void> {
        const items = event.orderItems?.map((item) => OrderItem.create(item));

        const order = Order.createWithId({ ...event, items });

        await this.orderQueryRepository.insertOne(order);
    }
}
