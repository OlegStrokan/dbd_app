import { registerAs } from '@nestjs/config';
import { OrderItemCommand } from 'src/order/infrastructure/entity/order-item/command/order-item-command.entity';
import { OrderCommand } from 'src/order/infrastructure/entity/order/order-command.entity';
import { ParcelCommand } from 'src/order/infrastructure/entity/parcel/parcel-command.entity';
import { RepaymentPreferencesCommand } from 'src/order/infrastructure/entity/repayment-preferences/repayment-preferences-command.entity';
import { ShippingCostCommand } from 'src/order/infrastructure/entity/shipping-cost/shipping-cost-command.entity';

export const DbCommandConfig = registerAs('commandConnection', () => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 6433,
    username: process.env.DB_USER || 'stroka01',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'order_command_db',
    entities: [OrderCommand, OrderItemCommand, ParcelCommand, RepaymentPreferencesCommand, ShippingCostCommand],
    logging: process.env.NODE_ENV === 'development',
    migrations: [`${__dirname}/migrations/*{.ts,.js}`],
    migrationsTableName: 'migrations',
}));
