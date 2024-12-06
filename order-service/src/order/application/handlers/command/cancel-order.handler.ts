import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CancelOrderCommand } from '../../command/cancel-order.command';
import { Inject, NotFoundException } from '@nestjs/common';
import { IOrderCommandRepository } from 'src/order/domain/order/order-command.repository';
import { OrderCancelledEvent } from 'src/order/domain/event/order-canceled.event';
import { OrderCommandRepository } from 'src/order/infrastructure/repository/order/order-command.repository';
import { OrderQueryRepository } from 'src/order/infrastructure/repository/order/order-query.repository';

@CommandHandler(CancelOrderCommand)
export class CancelOrderHandler implements ICommandHandler<CancelOrderCommand, void> {
    constructor(
        @Inject(OrderCommandRepository) private orderCommandRepository: IOrderCommandRepository,
        @Inject(OrderQueryRepository) private orderQueryRepository: OrderQueryRepository,
        private readonly eventBus: EventBus
    ) {}

    async execute(command: CancelOrderCommand): Promise<void> {
        const order = await this.orderQueryRepository.findById(command.id);
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        order.cancel();
        await this.orderCommandRepository.updateOne(order);

        this.eventBus.publish(new OrderCancelledEvent(order.id, order.customerId));
    }
}
