import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderData } from 'src/order/domain/order/order';
import { IOrderCommandRepository } from 'src/order/domain/order/order-command.repository';
import { OrderCommand } from '../../entity/order/order-command.entity';

@Injectable()
export class OrderCommandRepository implements IOrderCommandRepository {
    constructor(
        @InjectRepository(OrderCommand, 'commandConnection')
        private readonly orderRepository: Repository<OrderCommand>
    ) {}

    public async insertOne(order: OrderData): Promise<void> {
        await this.orderRepository.save(order);
    }

    public async updateOne(order: OrderData): Promise<void> {
        await this.orderRepository.save(order);
    }

    public async deleteOne(orderId: string): Promise<void> {
        await this.orderRepository.delete(orderId);
    }
}
