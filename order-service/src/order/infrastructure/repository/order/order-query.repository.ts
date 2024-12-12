import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/domain/order/order';
import { OrderQuery } from '../../entity/order/order-query.entity';
import { OrderQueryMapper } from '../../mapper/order/order-query.mapper';
import { ParcelQuery } from '../../entity/parcel/query/parcel-query.entity';

@Injectable()
export class OrderQueryRepository {
    constructor(
        @InjectRepository(OrderQuery, 'queryConnection')
        private readonly orderQueryRepository: Repository<OrderQuery>,
        @InjectRepository(ParcelQuery, 'queryConnection')
        private readonly parcelQueryRepository: Repository<ParcelQuery>
    ) {}

    public async findById(orderId: string): Promise<Order | null> {
        const orderEntity = await this.orderQueryRepository.findOne({ where: { id: orderId } });
        return orderEntity ? OrderQueryMapper.toDomain(orderEntity) : null;
    }

    public async insertOne(order: Order): Promise<void> {
        await this.orderQueryRepository.save(order.data);
    }

    public async updateOne(orderId: string, updateData: Partial<Order>): Promise<void> {
        console.log(orderId, updateData);
        await this.orderQueryRepository.update(orderId, updateData);
    }

    public async findAllWithItemsAndParcelsByCustomerId(customerId: string): Promise<Order[]> {
        const orders = await this.orderQueryRepository.find({ where: { customerId }, relations: ['items'] });

        const orderWithParcels = await Promise.all(
            orders?.map(async (order) => {
                const parcels = await this.parcelQueryRepository.find({
                    where: { orderId: order.id },
                });
                return {
                    ...order,
                    parcels,
                };
            })
        );

        return orderWithParcels?.map((orderWithParcels) => OrderQueryMapper.toDomain(orderWithParcels));
    }

    public async findAllByCustomerId(customerId: string): Promise<Order[]> {
        const orders = await this.orderQueryRepository.find({ where: { customerId } });
        return orders?.map((order) => OrderQueryMapper.toDomain(order));
    }
}
