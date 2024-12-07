import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ShipOrderCommand } from '../../command/order/ship-order.command';
import { Inject, NotFoundException } from '@nestjs/common';
import { IOrderCommandRepository } from 'src/order/domain/order/order-command.repository';
import { EventBus } from '@nestjs/cqrs';
import { OrderQueryRepository } from 'src/order/infrastructure/repository/order/order-query.repository';
import { OrderShippedEvent } from 'src/order/domain/event/order-item/order-shipped.event';
import { OrderCommandRepository } from 'src/order/infrastructure/repository/order/order-command.repository';

@CommandHandler(ShipOrderCommand)
export class ShipOrderHandler implements ICommandHandler<ShipOrderCommand, void> {
    constructor(
        @Inject(OrderCommandRepository) private orderRepository: IOrderCommandRepository,
        @Inject(OrderQueryRepository) private orderQueryRepository: OrderQueryRepository,
        private readonly eventBus: EventBus
    ) {}

    async execute(command: ShipOrderCommand): Promise<void> {
        const order = await this.orderQueryRepository.findById(command.id);
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        order.ship(command.trackingNumber, command.deliveryDate);
        await this.orderRepository.updateOne(order);

        this.eventBus.publish(new OrderShippedEvent(order.id, command.trackingNumber, command.deliveryDate));
    }
}
