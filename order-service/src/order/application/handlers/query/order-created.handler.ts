import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { OrderQueryRepository } from 'src/order/infrastructure/repository/order/order-query.repository';
import { Order } from 'src/order/domain/order/order';
import { OrderItem } from 'src/order/domain/order-item/order-item';
import { ParcelQueryRepository } from 'src/order/infrastructure/repository/parcel/parcel-query.repository';
import { OrderCreatedEvent } from 'src/order/domain/order/event/order-created.event';

@EventsHandler(OrderCreatedEvent)
export class OrderCreatedHandler implements IEventHandler<OrderCreatedEvent> {
    constructor(
        @Inject(OrderQueryRepository) private orderQueryRepository: OrderQueryRepository,
        @Inject(ParcelQueryRepository) private parcelQueryRepository: ParcelQueryRepository,
        private readonly logger: Logger
    ) {}

    async handle(event: OrderCreatedEvent): Promise<void> {
        try {
            let orderItems: OrderItem[] = [];
            if (event.items) {
                orderItems = event.items?.map((item) => {
                    return OrderItem.createWithIdAndDate({ ...item });
                });
            }

            const order = Order.createWithId({ ...event, items: orderItems });
            await this.orderQueryRepository.insertOne(order);
            await this.parcelQueryRepository.insertMany(order);

            this.logger.log(`Order table synchronized`);
        } catch (e) {
            console.warn(e.message);
        }
    }
}
