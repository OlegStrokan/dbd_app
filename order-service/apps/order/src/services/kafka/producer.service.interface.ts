import { Message } from 'kafkajs';

export interface IProducer {
  produce(topic: string, message: Message): Promise<void>;
}
