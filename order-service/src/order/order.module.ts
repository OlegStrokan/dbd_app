import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderCommandRepository } from './infrastructure/repository/order/order-command.repository';
import { Module } from '@nestjs/common';
import { CreateOrderHandler } from './application/handlers/command/create-order.handler';
import { OrderController } from './interface/order.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderCommand } from './infrastructure/entity/order/command/order-command.entity';
import { OrderItemCommand } from './infrastructure/entity/order-item/command/order-item-command.entity';
import { OrderQuery } from './infrastructure/entity/order/query/order-query.entity';
import { OrderItemQuery } from './infrastructure/entity/order-item/query/order-item-query.entity';
import { OrderItemCommandRepository } from './infrastructure/repository/order-item/order-item-command.repository';
import { ParcelCommandRepository } from './infrastructure/repository/parcel/parcel-command.repository';
import { ParcelQuery } from './infrastructure/entity/parcel/query/parcel-query.entity';
import { ParcelQueryRepository } from './infrastructure/repository/parcel/parcel-query.repository';
import { OrderItemQueryRepository } from './infrastructure/repository/order-item/order-query.repository';
import { OrderQueryRepository } from './infrastructure/repository/order/order-query.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderCommand, OrderItemCommand, ParcelCommandRepository], 'commandConnection'),
        TypeOrmModule.forFeature([OrderQuery, OrderItemQuery, ParcelQuery], 'queryConnection'),
        CqrsModule,
    ],
    controllers: [OrderController],
    providers: [
        OrderCommandRepository,
        OrderQueryRepository,
        ParcelQueryRepository,
        OrderItemQueryRepository,
        OrderItemCommandRepository,
        ParcelCommandRepository,
        CreateOrderHandler,
    ],
    exports: [
        OrderCommandRepository,
        OrderQueryRepository,
        ParcelQueryRepository,
        OrderItemQueryRepository,
        OrderItemCommandRepository,
        ParcelCommandRepository,
        CreateOrderHandler,
    ],
})
export class OrderModule {}
