import { OrderStatus } from 'src/order/domain/order/order';
import { OrderItemDto } from './order-item.dto';
import { ParcelDto } from './parcel.dto';

export class OrderDto {
    id: string;
    customerId: string;
    totalAmount: number;
    items: OrderItemDto[];
    status: OrderStatus;
    parcels?: ParcelDto[];
    updatedAt?: Date;
    version?: number;
    trackingNumber?: string;
    deliveryDate?: Date;
    feedback?: string;
    deliveryAddress?: string;
    paymentMethod?: string;
    specialInstructions?: string;
}
