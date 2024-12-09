import { registerAs } from '@nestjs/config';
import { OrderItemQuery } from 'src/order/infrastructure/entity/order-item/query/order-item-query.entity';
import { OrderProjection } from 'src/order/infrastructure/entity/order/order-projection.entity';
import { OrderQuery } from 'src/order/infrastructure/entity/order/order-query.entity';
import { ParcelQuery } from 'src/order/infrastructure/entity/parcel/query/parcel-query.entity';

export const DbQueryConfig = registerAs('queryConnection', () => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5433,
    username: process.env.DB_USER || 'stroka01',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'order_query_db',
    entities: [OrderQuery, OrderItemQuery, ParcelQuery, OrderProjection],
    logging: process.env.NODE_ENV === 'development',
    migrations: [`${__dirname}/../../migrations/*{.ts,.js}`],
    migrationsTableName: 'migrations',
}));
