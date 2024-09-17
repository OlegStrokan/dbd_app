import { ConsumerConfig, ConsumerSubscribeTopics, KafkaMessage } from 'kafkajs';

export interface IConsumer {
  consume(
    topic: ConsumerSubscribeTopics,
    config: ConsumerConfig,
    onMessage: (message: KafkaMessage) => Promise<void>
  ): Promise<void>;
}
