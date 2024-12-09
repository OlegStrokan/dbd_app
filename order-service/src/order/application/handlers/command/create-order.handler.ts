import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from '../../command/order/create-order.command';
import { Inject, Logger } from '@nestjs/common';
import { IOrderCommandRepository } from 'src/order/domain/order/order-command.repository';
import { OrderCommandRepository } from 'src/order/infrastructure/repository/order/order-command.repository';
import { OrderCreatedEvent } from 'src/order/domain/event/order/order-created.event';
import { OrderItem } from 'src/order/domain/order-item/order-item';
import { IParcelCommandRepository } from 'src/order/domain/parcel/parcel-command.repository';
import { ParcelCommandRepository } from 'src/order/infrastructure/repository/parcel/parcel-command.repository';
import { Order } from 'src/order/domain/order/order';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand, void> {
    constructor(
        @Inject(OrderCommandRepository) private orderRepository: IOrderCommandRepository,
        @Inject(ParcelCommandRepository) private parcelRepository: IParcelCommandRepository,
        private readonly eventBus: EventBus,
        private readonly logger: Logger
    ) {}

    async execute(command: CreateOrderCommand): Promise<void> {
        let orderItems: OrderItem[] = [];
        if (command.orderItems) {
            orderItems = command.orderItems?.map((item) => {
                return OrderItem.create({ ...item });
            });
        }

        const order = Order.create({
            customerId: command.customerId,
            totalAmount: command.totalAmount,
            createdAt: new Date(),
            items: orderItems ?? [],
        });

        await this.orderRepository.insertOne(order.data);

        await this.parcelRepository.insertMany(order);

        this.eventBus.publish(
            new OrderCreatedEvent(
                order.id,
                order.customerId,
                order.totalAmount,
                order.specialInstruction,
                order.paymentMethod,
                order.deliveryAddress,
                order.createdAt,
                order.items.map((item) => item.data)
            )
        );

        this.logger.log(`Order created`);
    }
}
