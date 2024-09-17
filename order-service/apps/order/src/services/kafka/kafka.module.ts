import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaConfigService } from './kafka-config.service';
import { Kafka } from 'kafkajs';
import { ProducerService } from './producer/producer.service';
import { ConsumerService } from './consumer/consumer.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    KafkaConfigService,
    {
      provide: 'KAFKA_SERVICE',
      useFactory: async (kafkaConfigService: KafkaConfigService) => {
        const { brokers, clientId, sasl } =
          kafkaConfigService.getKafkaOptions().options.client;
        const kafka = new Kafka({
          brokers,
          clientId,
          ssl: true,
          sasl,
        });
        return kafka;
      },
      inject: [KafkaConfigService],
    },
    ProducerService,
    ConsumerService,
  ],
  exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}
