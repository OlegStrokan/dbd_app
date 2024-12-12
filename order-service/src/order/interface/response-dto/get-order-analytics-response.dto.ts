import { OrderProjection } from 'src/order/infrastructure/entity/order/order-projection.entity';

export class GetOrderAnalyticsResponseDto {
    orders: OrderProjection[];
}
