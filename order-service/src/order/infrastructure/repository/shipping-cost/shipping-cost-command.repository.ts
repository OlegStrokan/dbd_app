import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingCostCommand } from '../../entity/shipping-cost/shipping-cost-command.entity';
import { ShippingCost, ShippingCostCreateDate } from 'src/order/domain/shipping-cost/shipping-cost';
import { ShippingCostCommandMapper } from '../../mapper/shipping-cost/shipping-cost-command.mapper';
import { IShippingCostCommandRepository } from 'src/order/domain/shipping-cost/shipping-cost-command.repository';

@Injectable()
export class ShippingCostCommandRepository implements IShippingCostCommandRepository {
    constructor(
        @InjectRepository(ShippingCostCommand)
        private readonly shippingCostCommandRepository: Repository<ShippingCostCommand>
    ) {}

    async create(data: ShippingCostCreateDate): Promise<void> {
        const shippingCostEntity = ShippingCostCommandMapper.toEntity(data);
        await this.shippingCostCommandRepository.save(shippingCostEntity);
    }

    async findByOrderId(orderId: string): Promise<ShippingCost | undefined> {
        const shippingCost = await this.shippingCostCommandRepository.findOne({ where: { orderId } });
        return ShippingCostCommandMapper.toDomain(shippingCost);
    }
}
