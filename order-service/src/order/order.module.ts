import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderCommandRepository } from './infrastructure/repository/order-command.repository';
import { Module } from '@nestjs/common';
import { CreateOrderHandler } from './application/event/order-created.handler';
import { OrderContoller } from './interface/order.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderCommand } from './infrastructure/entity/command/order-command.entity';
import { OrderItemCommand } from './infrastructure/entity/command/order-item-command.entity';
import { OrderQuery } from './infrastructure/entity/query/order-query.entity';
import { OrderItemQuery } from './infrastructure/entity/query/order-item-query.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([OrderCommand, OrderItemCommand], 'commandConnection'),
        TypeOrmModule.forFeature([OrderQuery, OrderItemQuery], 'queryConnection'),
        CqrsModule,
    ],
    controllers: [OrderContoller],
    providers: [OrderCommandRepository, CreateOrderHandler],
    exports: [OrderCommandRepository, CreateOrderHandler],
})
export class OrderModule {}
