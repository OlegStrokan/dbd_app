import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CompleteOrderCommand } from '../../command/order/complete-order.command';
import { OrderCommandRepository } from 'src/order/infrastructure/repository/order/order-command.repository';
import { IOrderCommandRepository } from 'src/order/domain/order/order-command.repository';
import { Inject, NotFoundException } from '@nestjs/common';
import { OrderQueryRepository } from 'src/order/infrastructure/repository/order/order-query.repository';
import { IOrderQueryRepository } from 'src/order/domain/order/order-query.repository';
import { OrderCompletedEvent } from 'src/order/domain/order/event/order-completed.event';

@CommandHandler(CompleteOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CompleteOrderCommand, void> {
    constructor(
        @Inject(OrderCommandRepository) private readonly orderCommandRepository: IOrderCommandRepository,
        @Inject(OrderQueryRepository) private readonly orderQueryRepository: IOrderQueryRepository,
        private readonly eventBus: EventBus
    ) {}

    public async execute(command: CompleteOrderCommand): Promise<void> {
        const order = await this.orderQueryRepository.findById(command.id);
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const completedOrder = order.complete();
        await this.orderCommandRepository.updateOne(completedOrder.data);

        this.eventBus.publish(new OrderCompletedEvent(order.id, new Date()));
    }
}
