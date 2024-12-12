import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderItem } from 'src/order/domain/order-item/order-item';
import { IOrderItemCommandRepository } from 'src/order/domain/order-item/order-item-command.repository';
import { OrderItemCommand } from '../../entity/order-item/command/order-item-command.entity';
import { OrderItemProperties } from 'src/order/domain/order-item/order-item.interface';

@Injectable()
export class OrderItemCommandRepository implements IOrderItemCommandRepository {
    constructor(
        @InjectRepository(OrderItemCommand, 'commandConnection')
        private readonly orderItemRepository: Repository<OrderItemCommand>
    ) {}
    public async insertOne(orderItem: OrderItemProperties): Promise<void> {
        const item = OrderItem.create(orderItem);
        await this.orderItemRepository.save(item);
    }
    public async insertMany(orderItems: OrderItemProperties[]): Promise<void> {
        const items = orderItems.map((item) => OrderItem.create(item));
        await this.orderItemRepository.save(items);
    }

    public async updateOne(orderItem: OrderItemProperties): Promise<void> {
        await this.orderItemRepository.update(orderItem.id, orderItem);
    }
    public async deleteOne(orderItemId: string): Promise<void> {
        this.orderItemRepository.delete(orderItemId);
    }
}
