import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import {ParcelDeliveryEntity} from "../../domain/entities/parcel-delivery";

config();

const configService = new ConfigService();

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [ParcelDeliveryEntity],
    synchronize: configService.get('nodenv') === 'development',
    logging: configService.get('nodenv') === 'development',
    migrations: ['src/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
});
