import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaModule } from './services/kafka/kafka.module';
import { DbCommandConfig } from './services/database/database-command.config';
import { DbQueryConfig } from './services/database/database-query.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderCommand } from './order/command/order-command.entity';
import { OrderQuery } from './order/query/order-query.entity';
import { OrderItemCommand } from './order/command/order-item-command.entity';
import { OrderCommandModule } from './order/command/order-command.module';
import { OrderQueryModule } from './order/query/order-query.module';
import { OrderItemQuery } from './order/query/order-item-query.entity';

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
        ...configService.get('command_db'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'queryConnection',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('query_db'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(
      [OrderCommand, OrderItemCommand],
      'commandConnection'
    ),
    TypeOrmModule.forFeature([OrderQuery, OrderItemQuery], 'queryConnection'),
    KafkaModule,
    OrderCommandModule,
    OrderQueryModule,
  ],
})
export class MainModule {}
