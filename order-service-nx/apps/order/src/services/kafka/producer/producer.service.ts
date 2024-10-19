import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Kafka, Producer, Message } from 'kafkajs';
import { KafkaConfigService } from '../kafka-config.service';
@Injectable()
export class ProducerService implements OnApplicationShutdown {
  private readonly producers = new Map<string, Producer>();

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafka: Kafka,
    private readonly kafkaConfigService: KafkaConfigService
  ) {}

  public async produce(topic: string, message: Message) {
    const producer = await this.getProducer(topic);
    const transaction = await producer.transaction();
    try {
      await transaction.send({
        topic,
        messages: [message],
      });
      await transaction.commit();
    } catch (err) {
      await transaction.abort();
      throw err;
    }
  }

  public async createProducer() {
    const config = this.kafkaConfigService.getKafkaOptions().options.producer;
    return this.kafka.producer({
      ...config,
    });
  }

  private async getProducer(topic: string): Promise<Producer> {
    let producer = this.producers.get(topic);
    if (!producer) {
      producer = await this.createProducer();
      await producer.connect();
      this.producers.set(topic, producer);
    }
    return producer;
  }

  public async onApplicationShutdown(): Promise<void> {
    for (const producer of this.producers.values()) {
      await producer.disconnect();
    }
  }
}
