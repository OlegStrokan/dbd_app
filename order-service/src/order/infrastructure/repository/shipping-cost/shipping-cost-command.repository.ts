import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingCostCommand } from '../../entity/shipping-cost/shipping-cost-command.entity';
import { ShippingCostData } from 'src/order/domain/shipping-cost/shipping-cost';

@Injectable()
export class ShippingCostCommandRepository {
    constructor(
        @InjectRepository(ShippingCostCommand)
        private readonly shippingCostCommandRepository: Repository<ShippingCostCommand>
    ) {}

    async createShippingCost(data: ShippingCostData): Promise<ShippingCostCommand> {
        return this.shippingCostCommandRepository.save(data);
    }

    async findByOrderId(orderId: string): Promise<ShippingCostCommand | undefined> {
        return this.shippingCostCommandRepository.findOne({ where: { orderId } });
    }
}
