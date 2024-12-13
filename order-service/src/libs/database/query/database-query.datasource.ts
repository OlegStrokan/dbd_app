import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { OrderItemQuery } from 'src/order/infrastructure/entity/order-item/query/order-item-query.entity';
import { ParcelQuery } from 'src/order/infrastructure/entity/parcel/query/parcel-query.entity';
import { OrderQuery } from 'src/order/infrastructure/entity/order/order-query.entity';
import { OrderProjection } from 'src/order/infrastructure/entity/order/order-projection.entity';
import { RepaymentPreferencesQuery } from 'src/order/infrastructure/entity/repayment-preferences/repayment-preferences-query.entity';

config();

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5433,
    username: process.env.DB_USER || 'stroka01',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'order_query_db',
    entities: [OrderQuery, OrderItemQuery, ParcelQuery, OrderProjection, RepaymentPreferencesQuery],
    logging: process.env.NODE_ENV === 'development',
    migrations: [`${__dirname}/migrations/*{.ts,.js}`],
    migrationsTableName: 'migrations',
});
