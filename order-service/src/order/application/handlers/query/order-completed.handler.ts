import { Inject, NotFoundException } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderCompletedEvent } from 'src/order/domain/event/order/order-completed.event';
import { OrderQueryRepository } from 'src/order/infrastructure/repository/order/order-query.repository';

@EventsHandler(OrderCompletedEvent)
export class OrderCompletedHandler implements IEventHandler<OrderCompletedEvent> {
    constructor(@Inject(OrderQueryRepository) private orderQueryRepository: OrderQueryRepository) {}

    async handle(event: OrderCompletedEvent): Promise<void> {
        const order = await this.orderQueryRepository.findById(event.orderId);
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        order.commit;
        await this.orderQueryRepository.updateOne(order.id, order);
    }
}
