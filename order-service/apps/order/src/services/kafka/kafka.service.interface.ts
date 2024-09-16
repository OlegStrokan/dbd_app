export interface IKafkaService {
  produceMessage(topic: string, message: any): Promise<void>;
  consumeMessages(topic: string): Promise<void>;
}
