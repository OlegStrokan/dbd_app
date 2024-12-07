import { AggregateRoot } from '@nestjs/cqrs';
import { InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { ErrorMessages } from '../error-messages.enum';
import { OrderItem } from '../order-item/order-item';
import { generateUlid } from 'src/libs/generate-ulid';

export type OrderEssentialProperties = Required<{
    id: string;
    customerId: string;
    totalAmount: number;
    deliveryAddress?: string;
    paymentMethod?: string;
    specialInstructions?: string;
    items?: OrderItem[];
}>;

export type OrderOptionalProperties = Partial<{
    orderDate?: Date;
    items?: OrderItem[];
    createdAt?: Date;
    status: OrderStatus;
    updatedAt?: Date;
    version?: number;
    trackingNumber?: string;
    deliveryDate?: Date;
    feedback?: string;
}>;

export type OrderData = OrderEssentialProperties & OrderOptionalProperties;

export interface IOrder {
    compareId: (id: string) => boolean;
    complete: () => void;
    cancel: () => void;
    ship: (trackingNumber: string, deliveryDate: Date) => void;
    addItem: (item: OrderItem) => void;
    commit: () => void;
}

export class Order extends AggregateRoot implements IOrder {
    constructor(private orderData: OrderData) {
        super();
    }

    static generateOrderId = () => generateUlid();

    static create(orderData: Omit<OrderEssentialProperties, 'id'>): Order {
        const order = new Order({
            ...orderData,
            status: OrderStatus.Created,
            createdAt: new Date(),
            id: generateUlid(),
        });

        return order;
    }

    static createWithId(orderData: OrderEssentialProperties): Order {
        const order = new Order({
            ...orderData,
            status: OrderStatus.Created,
            createdAt: new Date(),
        });

        return order;
    }

    compareId(id: string): boolean {
        return id === this.id;
    }

    complete(): void {
        const clonedOrder = this.clone();
        if (!clonedOrder.isValidStatusChange(OrderStatus.Created, OrderStatus.Completed)) {
            throw new UnprocessableEntityException(ErrorMessages.ORDER_NOT_IN_CREATED_STATE);
        }
        clonedOrder.orderData.status = OrderStatus.Completed;
        clonedOrder.orderData.updatedAt = new Date();
    }

    cancel(): void {
        const clonedOrder = this.clone();
        if (!clonedOrder.isValidStatusChange(clonedOrder.status, OrderStatus.Canceled)) {
            throw new UnprocessableEntityException(ErrorMessages.ORDER_NOT_CANCELABLE);
        }

        clonedOrder.orderData.status = OrderStatus.Canceled;
        clonedOrder.orderData.updatedAt = new Date();
    }

    ship(trackingNumber: string, deliveryDate: Date): void {
        const clonedOrder = this.clone();
        if (!clonedOrder.isValidStatusChange(clonedOrder.status, OrderStatus.Shipped)) {
            throw new UnprocessableEntityException(ErrorMessages.ORDER_NOT_COMPLETED);
        }

        clonedOrder.orderData.trackingNumber = trackingNumber;
        clonedOrder.orderData.deliveryDate = deliveryDate;
        clonedOrder.orderData.updatedAt = new Date();
    }

    addItem(item: OrderItem): void {
        const clonedOrder = this.clone();
        if (!item) {
            throw new InternalServerErrorException(ErrorMessages.INVALID_ORDER_ITEM);
        }
        clonedOrder.orderData.items.push(item);
        clonedOrder.orderData.totalAmount += item.price * item.quantity;
        clonedOrder.orderData.updatedAt = new Date();
    }

    setDeliveryAddress(address: string): void {
        const clonedOrder = this.clone();
        clonedOrder.orderData.deliveryAddress = address;
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

    get items(): OrderItem[] {
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

    get specialInstruction(): string | undefined {
        return this.orderData.specialInstructions;
    }

    get paymentMethod(): string | undefined {
        return this.orderData.paymentMethod;
    }

    get deliveryAddress(): string | undefined {
        return this.orderData.deliveryAddress;
    }
    private clone(): Order {
        return new Order({ ...this.orderData });
    }

    private isValidStatusChange(currentStatus: string, nextStatus: string): boolean {
        return VALID_STATUS_CHANGES[currentStatus]?.includes(nextStatus) ?? false;
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
