import { Inject, NotFoundException } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderCancelledEvent } from 'src/order/domain/event/order/order-canceled.event';
import { OrderQueryRepository } from 'src/order/infrastructure/repository/order/order-query.repository';

@EventsHandler(OrderCancelledEvent)
export class OrderCancelledHandler implements IEventHandler<OrderCancelledEvent> {
    constructor(@Inject(OrderQueryRepository) private orderQueryRepository: OrderQueryRepository) {}

    async handle(event: OrderCancelledEvent): Promise<void> {
        const order = await this.orderQueryRepository.findById(event.orderId);
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        order.cancel();
        await this.orderQueryRepository.updateOne(order.id, order);
    }
}
