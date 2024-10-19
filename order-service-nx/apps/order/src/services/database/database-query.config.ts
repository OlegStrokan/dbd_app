import { registerAs } from '@nestjs/config';
import { OrderQuery } from '../../order/query/order-query.entity';
import { OrderItemQuery } from '../../order/query/order-item-query.entity';

export const DbQueryConfig = registerAs('queryConnection', () => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5433,
  username: process.env.DB_USER || 'stroka01',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'order_query_db',
  entities: [OrderQuery, OrderItemQuery],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  migrations: [`${__dirname}/../../migrations/query/*{.ts,.js}`],
  migrationsTableName: 'migrations',
}));
