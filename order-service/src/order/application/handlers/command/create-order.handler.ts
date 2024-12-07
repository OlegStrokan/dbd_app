import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from '../../command/order/create-order.command';
import { Inject } from '@nestjs/common';
import { Order } from 'src/order/domain/order/order';
import { IOrderCommandRepository } from 'src/order/domain/order/order-command.repository';
import { OrderCommandRepository } from 'src/order/infrastructure/repository/order/order-command.repository';
import { OrderCreatedEvent } from 'src/order/domain/event/order/order-created.event';
import { OrderItem } from 'src/order/domain/order-item/order-item';
import { Parcel } from 'src/order/domain/parcel/parcel';
import { OrderItemAddedEvent } from 'src/order/domain/event/order-item/order-item-added.event';
import { ParcelCreatedEvent } from 'src/order/domain/event/parcel/parcel-created.event';
import { IParcelCommandRepository } from 'src/order/domain/parcel/parcel-command.repository';
import { IOrderItemCommandRepository } from 'src/order/domain/order-item/order-item-command.repository';
import { OrderItemCommandRepository } from 'src/order/infrastructure/repository/order-item/order-item-command.repository';
import { ParcelCommandRepository } from 'src/order/infrastructure/repository/parcel/parcel-command.repository';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand, void> {
    constructor(
        @Inject(OrderCommandRepository) private orderRepository: IOrderCommandRepository,
        @Inject(OrderItemCommandRepository) private orderItemRepository: IOrderItemCommandRepository,
        @Inject(ParcelCommandRepository) private parcelRepository: IParcelCommandRepository,
        private readonly eventBus: EventBus
    ) {}

    async execute(command: CreateOrderCommand): Promise<void> {
        const orderItems: OrderItem[] = command.orderItems.map((item) => {
            return OrderItem.create({ ...item });
        });

        const order = Order.create({
            customerId: command.customerId,
            totalAmount: command.totalAmount,
            deliveryAddress: command.deliveryAddress,
            paymentMethod: command.paymentMethod,
            specialInstructions: command.specialInstructions,
            items: orderItems,
        });

        await this.orderRepository.insertOne(order);

        for (const item of orderItems) {
            await this.orderItemRepository.insertOne(item);
            this.eventBus.publish(
                new OrderItemAddedEvent(item.id, item.productId, item.quantity, item.price, item.weight)
            );
        }

        const parcels = Parcel.createParcels(order.id, order.items);
        await this.parcelRepository.insertMany(order);

        for (const parcel of parcels) {
            this.eventBus.publish(new ParcelCreatedEvent(parcel.id, order.id, parcel.weight, parcel.dimensions));
        }

        this.eventBus.publish(
            new OrderCreatedEvent(
                order.id,
                order.customerId,
                order.totalAmount,
                order.specialInstruction,
                order.paymentMethod,
                order.deliveryAddress,
                orderItems
            )
        );
    }
}
