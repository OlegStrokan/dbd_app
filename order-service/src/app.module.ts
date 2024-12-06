import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbCommandConfig } from './libs/database/command/database-command.config';
import { DbQueryConfig } from './libs/database/query/database-query.config';
import { KafkaModule } from './libs/kafka/kafka.module';
import { OrderModule } from './order/order.module';
import { OrderCommand } from './order/infrastructure/entity/command/order-command.entity';
import { OrderItemCommand } from './order/infrastructure/entity/command/order-item-command.entity';
import { OrderQuery } from './order/infrastructure/entity/query/order-query.entity';
import { OrderItemQuery } from './order/infrastructure/entity/query/order-item-query.entity';

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
        TypeOrmModule.forFeature([OrderCommand, OrderItemCommand], 'commandConnection'),
        TypeOrmModule.forFeature([OrderQuery, OrderItemQuery], 'queryConnection'),
        KafkaModule,
        OrderModule,
    ],
})
export class AppModule {}
