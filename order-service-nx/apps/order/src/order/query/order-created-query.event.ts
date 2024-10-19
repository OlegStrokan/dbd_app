import { OrderQuery } from './order-query.entity';

export class OrderCreatedQueryEvent {
  readonly orderId: string;
  readonly customerId: string;
  readonly totalAmount: number;
  readonly orderDate: Date;
  readonly status: string;
  readonly deliveryAddress?: string;
  readonly paymentMethod?: string;
  readonly deliveryDate?: Date;
  readonly trackingNumber?: string;
  readonly feedback?: string;
  readonly specialInstructions?: string;
  readonly items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;

  constructor(order: OrderQuery) {
    this.orderId = order.id;
    this.customerId = order.customerId;
    this.totalAmount = order.totalAmount;
    this.orderDate = order.orderDate;
    this.status = order.status;
    this.deliveryAddress = order.deliveryAddress;
    this.paymentMethod = order.paymentMethod;
    this.deliveryDate = order.deliveryDate;
    this.trackingNumber = order.trackingNumber;
    this.feedback = order.feedback;
    this.specialInstructions = order.specialInstructions;
    this.items = order.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));
  }
}
