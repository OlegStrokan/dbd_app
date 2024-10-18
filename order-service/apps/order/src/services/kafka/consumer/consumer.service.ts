import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import {
  Kafka,
  Consumer,
  ConsumerConfig,
  KafkaMessage,
  ConsumerSubscribeTopics,
} from 'kafkajs';
import { KafkaConfigService } from '../kafka-config.service';
import { ProducerService } from '../producer/producer.service';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly consumers = new Map<string, Consumer>();

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafka: Kafka,
    private readonly kafkaConfigService: KafkaConfigService,
    private readonly producerService: ProducerService
  ) {}

  public async consume(
    topics: ConsumerSubscribeTopics,
    config: ConsumerConfig,
    onMessage: (message: KafkaMessage) => Promise<void>
  ): Promise<void> {
    const topicString = String(topics.topics[0]);
    let consumer = this.consumers.get(topicString);
    if (!consumer) {
      consumer = await this.createConsumer(config);
      await consumer.subscribe({
        topics: [topicString],
        fromBeginning: false,
      });
      this.consumers.set(topicString, consumer);
    }
    await consumer.run({
      eachMessage: async ({ message, partition, topic }) => {
        try {
          await onMessage(message);
          await consumer.commitOffsets([
            {
              topic,
              partition,
              offset: (parseInt(message.offset, 10) + 1).toString(),
            },
          ]);
        } catch (err) {
          await this.addMessageToDlq(message, topic);
        }
      },
    });
  }

  private async createConsumer(config: ConsumerConfig): Promise<Consumer> {
    const kafkaConfigConsumer =
      this.kafkaConfigService.getKafkaOptions().options.consumer;
    return this.kafka.consumer({
      ...config,
      ...kafkaConfigConsumer,
    });
  }

  private async addMessageToDlq(
    message: KafkaMessage,
    topic: string
  ): Promise<void> {
    const deadLetterTopic = `${topic}-dlq`;
    const producer = await this.producerService.createProducer();
    await producer.send({
      topic: deadLetterTopic,
      messages: [{ value: message.value }],
    });
  }
  public async onApplicationShutdown(): Promise<void> {
    for (const consumer of this.consumers.values()) {
      await consumer.disconnect;
    }
  }
}
