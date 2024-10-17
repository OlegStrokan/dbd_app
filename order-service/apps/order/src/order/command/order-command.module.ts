import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderCommandController } from './order-command.controller';
import { OrderCommandService } from './order-command.service';
import { OrderCommandRepository } from './order-command.repository';
import { OrderCommand } from './order-command.entity';
import { OrderItemCommand } from './order-item-command.entity';
import { ProducerService } from '../../services/kafka/producer/producer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [OrderCommand, OrderItemCommand],
      'commandConnection'
    ),
  ],
  controllers: [OrderCommandController],
  providers: [OrderCommandService, OrderCommandRepository, ProducerService],
  exports: [OrderCommandService, OrderCommandRepository],
})
export class OrderCommandModule {}
