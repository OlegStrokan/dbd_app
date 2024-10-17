import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderQuery } from './order-query.entity';
import { OrderItemQuery } from './order-item-query.entity';
import { OrderQueryController } from './order-query.contoller';
import { ProducerService } from '../../services/kafka/producer/producer.service';
import { OrderQueryService } from './order-query.service';
import { OrderQueryRepository } from './order-query.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderQuery, OrderItemQuery], 'queryConnection'),
  ],
  controllers: [OrderQueryController],
  providers: [OrderQueryService, OrderQueryRepository, ProducerService],
  exports: [OrderQueryService, OrderQueryRepository],
})
export class OrderQueryModule {}
