import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
    customerId: string;
    totalAmount: number;
    orderItems?: OrderItemDto[];
}
