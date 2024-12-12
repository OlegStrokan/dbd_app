import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/domain/order/order';
import { OrderItem } from 'src/order/domain/order-item/order-item';
import { OrderItemQuery } from '../../entity/order-item/query/order-item-query.entity';
import { OrderItemQueryMapper } from '../../mapper/order-item/order-item-query.mapper';

@Injectable()
export class OrderItemQueryRepository {
    constructor(
        @InjectRepository(OrderItemQuery, 'queryConnection')
        private readonly orderQueryRepository: Repository<OrderItemQuery>
    ) {}

    public async findById(orderId: string): Promise<OrderItem | null> {
        const orderItemEntity = await this.orderQueryRepository.findOne({ where: { id: orderId } });
        return OrderItemQueryMapper.toDomain(orderItemEntity);
    }

    public async insertOne(order: Order): Promise<void> {
        const newOrder = this.orderQueryRepository.create(order);
        await this.orderQueryRepository.save(newOrder);
    }

    public async updateOne(orderId: string, updateData: Partial<Order>): Promise<void> {
        await this.orderQueryRepository.update(orderId, updateData);
    }

    public async findAll(): Promise<OrderItem[]> {
        const orders = await this.orderQueryRepository.find();
        return orders.map((order) => OrderItemQueryMapper.toDomain(order));
    }
}
