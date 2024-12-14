import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingCostQuery } from '../../entity/shipping-cost/shipping-cost-query.entity';

@Injectable()
export class ShippingCostQueryRepository {
    constructor(
        @InjectRepository(ShippingCostQuery)
        private readonly shippingCostQueryRepository: Repository<ShippingCostQuery>
    ) {}

    async findByOrderId(orderId: string): Promise<ShippingCostQuery | undefined> {
        return this.shippingCostQueryRepository.findOne({ where: { orderId } });
    }
}
