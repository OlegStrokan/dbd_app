import { Message, Producer } from 'kafkajs';

export interface IProducer {
  produce(topic: string, message: Message): Promise<void>;
  createProducer(): Promise<Producer>;
}
