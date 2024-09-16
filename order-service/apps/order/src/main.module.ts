import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { kafkaConfig } from './services/kafka/kafka.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        ...kafkaConfig,
      },
    ]),
  ],
})
export class MainModule {}
