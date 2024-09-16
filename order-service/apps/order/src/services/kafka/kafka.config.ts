import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: [process.env.KAFKA_BROKER],
      clientId: process.env.KAFKA_CLIENT_ID,
      sasl:
        process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD
          ? {
              mechanism: 'plain',
              username: process.env.KAFKA_USERNAME,
              password: process.env.KAFKA_PASSWORD,
            }
          : undefined,
      ssl: Boolean(process.env.KAFKA_SSL) === true,
    },
    consumer: {
      groupId: process.env.KAFKA_GROUP_ID,
      allowAutoTopicCreation: true,
    },
    producer: {
      allowAutoTopicCreation: true,
      idempotent: true,
      transactionalId: process.env.KAFKA_TRANSACTIONAL_ID,
      transactionTimeout: 30000,
      retry: {
        retries: 5,
        initialRetryTime: 300,
      },
    },
  },
};
