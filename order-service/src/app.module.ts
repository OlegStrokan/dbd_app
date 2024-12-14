import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbCommandConfig } from './libs/database/command/database-command.config';
import { DbQueryConfig } from './libs/database/query/database-query.config';
import { KafkaModule } from './libs/kafka/kafka.module';
import { OrderModule } from './order/order.module';
import { OrderItemCommand } from './order/infrastructure/entity/order-item/command/order-item-command.entity';
import { OrderQuery } from './order/infrastructure/entity/order/order-query.entity';
import { OrderItemQuery } from './order/infrastructure/entity/order-item/query/order-item-query.entity';
import { ParcelCommand } from './order/infrastructure/entity/parcel/parcel-command.entity';
import { OrderCommand } from './order/infrastructure/entity/order/order-command.entity';
import { OrderProjection } from './order/infrastructure/entity/order/order-projection.entity';
import { ParcelQuery } from './order/infrastructure/entity/parcel/parcel-query.entity';
import { RepaymentPreferencesCommand } from './order/infrastructure/entity/repayment-preferences/repayment-preferences-command.entity';
import { RepaymentPreferencesQuery } from './order/infrastructure/entity/repayment-preferences/repayment-preferences-query.entity';
import { ShippingCostQuery } from './order/infrastructure/entity/shipping-cost/shipping-cost-query.entity';
import { ShippingCostCommand } from './order/infrastructure/entity/shipping-cost/shipping-cost-command.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            load: [DbCommandConfig, DbQueryConfig],
            envFilePath: `.env`,
        }),
        TypeOrmModule.forRootAsync({
            name: 'commandConnection',
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                ...configService.get('commandConnection'),
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forRootAsync({
            name: 'queryConnection',
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                ...configService.get('queryConnection'),
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature(
            [OrderCommand, OrderItemCommand, ParcelCommand, RepaymentPreferencesCommand, ShippingCostCommand],
            'commandConnection'
        ),
        TypeOrmModule.forFeature(
            [OrderQuery, OrderItemQuery, ParcelQuery, OrderProjection, RepaymentPreferencesQuery, ShippingCostQuery],
            'queryConnection'
        ),
        KafkaModule,
        OrderModule,
    ],
})
export class AppModule {}
