import { Inject, NotFoundException } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderShippedEvent } from 'src/order/domain/order/event/order-shipped.event';
import { OrderQueryRepository } from 'src/order/infrastructure/repository/order/order-query.repository';

@EventsHandler(OrderShippedEvent)
export class OrderShippeHandler implements IEventHandler<OrderShippedEvent> {
    constructor(@Inject(OrderQueryRepository) private orderQueryRepository: OrderQueryRepository) {}

    async handle(event: OrderShippedEvent): Promise<void> {
        const order = await this.orderQueryRepository.findById(event.orderId);
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        order.ship(event.trackingNumber, event.deliveryDate);
        await this.orderQueryRepository.updateOne(order.id, order);
    }
}
