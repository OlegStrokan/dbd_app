import { IOrderProjectionRepository } from 'src/order/domain/order/order-projection.repository';
import { OrderProjection } from '../../entity/order/order-projection.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderProjectionRepository implements IOrderProjectionRepository {
    constructor(
        @InjectRepository(OrderProjection, 'queryConnection')
        private readonly orderProjectionRepository: Repository<OrderProjection>
    ) {}
    async insertOne(orderProjection: Partial<OrderProjection>): Promise<void> {
        const projection = this.orderProjectionRepository.create(orderProjection);
        await this.orderProjectionRepository.save(projection);
    }

    async updateOne(orderProjection: Partial<OrderProjection>): Promise<void> {
        await this.orderProjectionRepository.update(orderProjection.id, orderProjection);
    }

    async findById(id: string): Promise<OrderProjection | undefined> {
        return await this.orderProjectionRepository.findOneBy({ id });
    }

    async findAll(): Promise<OrderProjection[]> {
        return await this.orderProjectionRepository.find();
    }

    async deleteById(id: string): Promise<void> {
        await this.orderProjectionRepository.delete(id);
    }
}
