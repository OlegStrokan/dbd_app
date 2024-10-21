import { OrderItemDto } from './order-item.dto';

export class OrderDto {
    id: string;
    customerId: string;
    totalAmount: number;
    items: OrderItemDto[];
    status: string;
}
