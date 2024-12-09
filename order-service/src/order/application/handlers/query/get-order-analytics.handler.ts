import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { FindOrdersQuery } from '../../query/find-orders.query';
import { GetOrderAnalyticsQuery } from '../../query/get-order-analytics.query';
import { OrderProjectionRepository } from 'src/order/infrastructure/repository/order/order-projection.repository';
import { OrderProjection } from 'src/order/infrastructure/entity/order/order-projection.entity';

@QueryHandler(GetOrderAnalyticsQuery)
export class GetOrderAnalyticsHandler implements IQueryHandler<GetOrderAnalyticsQuery> {
    constructor(@Inject(OrderProjectionRepository) private orderAnalyticsRepository: OrderProjectionRepository) {}

    async execute(query: FindOrdersQuery): Promise<OrderProjection[]> {
        // TODO send query.filter.customerId to params
        return await this.orderAnalyticsRepository.findAll();
    }
}
