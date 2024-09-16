import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { IKafkaService } from './kafka.service.interface';
@Injectable()
export class KafkaService
  implements IKafkaService, OnModuleInit, OnModuleDestroy
{
  private producer;
  private consumer;

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.producer = this.kafkaClient.;
  }
  async produceMessage(topic: string, message: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async consumeMessages(topic: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
