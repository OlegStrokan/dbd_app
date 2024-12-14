import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderCommandRepository } from './infrastructure/repository/order/order-command.repository';
import { Logger, Module } from '@nestjs/common';
import { CreateOrderHandler } from './application/handlers/command/create-order.handler';
import { OrderController } from './interface/order.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderItemCommand } from './infrastructure/entity/order-item/command/order-item-command.entity';
import { OrderQuery } from './infrastructure/entity/order/order-query.entity';
import { OrderItemQuery } from './infrastructure/entity/order-item/query/order-item-query.entity';
import { OrderItemCommandRepository } from './infrastructure/repository/order-item/order-item-command.repository';
import { ParcelCommandRepository } from './infrastructure/repository/parcel/parcel-command.repository';
import { ParcelQueryRepository } from './infrastructure/repository/parcel/parcel-query.repository';
import { OrderItemQueryRepository } from './infrastructure/repository/order-item/order-query.repository';
import { ParcelCommand } from './infrastructure/entity/parcel/parcel-command.entity';
import { OrderQueryRepository } from './infrastructure/repository/order/order-query.repository';
import { OrderCreatedHandler } from './application/handlers/query/order-created.handler';
import { FindAllOrdersHandler } from './application/handlers/query/find-all-orders.handler';
import { OrderCommand } from './infrastructure/entity/order/order-command.entity';
import { OrderProjection } from './infrastructure/entity/order/order-projection.entity';
import { OrderProjectionRepository } from './infrastructure/repository/order/order-projection.repository';
import { GetOrderAnalyticsHandler } from './application/handlers/query/get-order-analytics.handler';
import { OrderCreatedProjectionHandler } from './application/handlers/event/order-created.handler';
import { OrderShippeHandler } from './application/handlers/query/order-shipped.handler';
import { OrderCompletedHandler } from './application/handlers/query/order-completed.handler';
import { OrderCancelledHandler } from './application/handlers/query/order-canceled.handler';
import { CancelOrderHandler } from './application/handlers/command/cancel-order.handler';
import { ShipOrderHandler } from './application/handlers/command/ship-order.handler';
import { ShippingCostCommand } from './infrastructure/entity/shipping-cost/shipping-cost-command.entity';
import { ShippingCostQuery } from './infrastructure/entity/shipping-cost/shipping-cost-query.entity';
import { ParcelQuery } from './infrastructure/entity/parcel/parcel-query.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [OrderCommand, OrderItemCommand, ParcelCommand, ShippingCostCommand],
            'commandConnection'
        ),
        TypeOrmModule.forFeature(
            [OrderQuery, OrderItemQuery, ParcelQuery, OrderProjection, ShippingCostQuery],
            'queryConnection'
        ),
        CqrsModule,
    ],
    controllers: [OrderController],
    providers: [
        Logger,
        OrderCommandRepository,
        OrderQueryRepository,
        ParcelQueryRepository,
        OrderItemQueryRepository,
        OrderProjectionRepository,
        OrderItemCommandRepository,
        ParcelCommandRepository,
        CreateOrderHandler,
        CancelOrderHandler,
        ShipOrderHandler,
        OrderCreatedHandler,
        OrderCancelledHandler,
        OrderShippeHandler,
        OrderCompletedHandler,
        FindAllOrdersHandler,
        OrderCreatedProjectionHandler,
        GetOrderAnalyticsHandler,
    ],
    exports: [
        OrderCommandRepository,
        OrderQueryRepository,
        ParcelQueryRepository,
        OrderItemQueryRepository,
        OrderProjectionRepository,
        OrderItemCommandRepository,
        ParcelCommandRepository,
        CreateOrderHandler,
        CancelOrderHandler,
        ShipOrderHandler,
        OrderCreatedHandler,
        OrderCancelledHandler,
        OrderShippeHandler,
        OrderCompletedHandler,
        OrderCreatedProjectionHandler,
        FindAllOrdersHandler,
        GetOrderAnalyticsHandler,
    ],
})
export class OrderModule {}
