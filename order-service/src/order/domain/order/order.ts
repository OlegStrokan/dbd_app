import { AggregateRoot } from '@nestjs/cqrs';
import { IOrderItem } from '../order-item/order-item.interface';
import { UnprocessableEntityException } from '@nestjs/common';
import { ErrorMessages } from '../error-messages.enum';
import { OrderItem } from '../order-item/order-item';
import { OrderCreatedEvent } from '../event/order-created.event';

export type OrderEssentialProperties = Readonly<Required<{ id: string; customerId: string; totalAmount: number }>>;

export type OrderOptionalProperties = Partial<{
    orderDate: Date;
    status: OrderStatus;
    deliveryAddress: string;
    paymentMethod: string;
    items: IOrderItem[];
    createdAt: Date;
    updatedAt: Date;
    version: number;
    trackingNumber: string;
    deliveryDate: Date;
    feedback: string;
}>;

export type OrderData = OrderEssentialProperties & Required<OrderOptionalProperties>;

export interface IOrder {
    compareId: (id: string) => boolean;
    create: () => void;
    complete: () => void;
    cancel: () => void;
    ship: (trackingNumber: string, deliveryDate: Date) => void;
    addItem: (item: IOrderItem) => void;
    commit: () => void;
}

export class Order extends AggregateRoot implements IOrder {
    constructor(private orderData: OrderData) {
        super();
    }

    get id(): string {
        return this.orderData.id;
    }

    get customerId(): string {
        return this.orderData.customerId;
    }

    get totalAmount(): number {
        return this.orderData.totalAmount;
    }

    get status(): string {
        return this.orderData.status || OrderStatus.Pending;
    }

    get orderDate(): Date {
        return this.orderData.orderDate || new Date();
    }

    get items(): IOrderItem[] {
        return this.orderData.items || [];
    }

    get trackingNumber(): string | undefined {
        return this.orderData.trackingNumber;
    }

    get deliveryDate(): Date | undefined {
        return this.orderData.deliveryDate;
    }

    get feedback(): string | undefined {
        return this.orderData.feedback;
    }

    create(): void {
        const order = this.clone();
        if (this.status) {
            throw new UnprocessableEntityException(ErrorMessages.ORDER_ALREADY_CREATED);
        }
        order.orderData.status = OrderStatus.Created;
        order.orderData.createdAt = new Date();
        order.apply(new OrderCreatedEvent(order.id, order.customerId, order.totalAmount));
    }

    private clone(): Order {
        return new Order({ ...this.orderData });
    }
}

export enum OrderStatus {
    Created = 'Created',
    Completed = 'Completed',
    Canceled = 'Canceled',
    Shipped = 'Shipped',
    Pending = 'Pending',
}

type CurrentStatus = OrderStatus;
type NextStatus = OrderStatus;

const VALID_STATUS_CHANGES: Record<CurrentStatus, NextStatus[]> = {
    [OrderStatus.Created]: [OrderStatus.Completed, OrderStatus.Canceled, OrderStatus.Shipped],
    [OrderStatus.Completed]: [OrderStatus.Canceled, OrderStatus.Shipped],
    [OrderStatus.Canceled]: [],
    [OrderStatus.Shipped]: [],
    [OrderStatus.Pending]: [],
};
