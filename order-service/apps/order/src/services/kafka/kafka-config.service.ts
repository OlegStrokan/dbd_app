import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class KafkaConfigService {
  constructor(private readonly configService: ConfigService) {}

  getKafkaOptions(): KafkaOptions {
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [this.configService.get('KAFKA_BROKER')],
          clientId: this.configService.get('KAFKA_CLIENT_ID'),
          sasl:
            this.configService.get('KAFKA_USERNAME') &&
            this.configService.get('KAFKA_PASSWORD')
              ? {
                  mechanism: 'plain',
                  username: this.configService.get('KAFKA_USERNAME'),
                  password: this.configService.get('KAFKA_PASSWORD'),
                }
              : undefined,
          ssl: Boolean(this.configService.get('KAFKA_SSL')),
        },
        consumer: {
          groupId: this.configService.get('KAFKA_GROUP_ID'),
          allowAutoTopicCreation: true,
        },
        producer: {
          allowAutoTopicCreation: true,
          idempotent: true,
          transactionalId: this.configService.get('KAFKA_TRANSACTIONAL_ID'),
          transactionTimeout: 30000,
          retry: {
            retries: 5,
            initialRetryTime: 300,
          },
        },
      },
    };
  }
}
