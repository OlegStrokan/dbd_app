import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { OrderCommand } from '../../order/command/order-command.entity';
import { OrderItemCommand } from '../../order/command/order-item-command.entity';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 6433,
  username: process.env.DB_USER || 'stroka01',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'order_command_db',
  entities: [OrderCommand, OrderItemCommand],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  migrations: [`${__dirname}/../../migrations/command/*{.ts,.js}`],
  migrationsTableName: 'migrations',
});
