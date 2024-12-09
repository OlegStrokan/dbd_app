import { AggregateRoot } from '@nestjs/cqrs';
import { InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { ErrorMessages } from '../error-messages.enum';
import { OrderItem } from '../order-item/order-item';
import { generateUlid } from 'src/libs/generate-ulid';
import { Parcel } from '../parcel/parcel';

export type OrderEssentialProperties = Required<{
    id: string;
    customerId: string;
    totalAmount: number;
    createdAt: Date;
    items: OrderItem[];
}>;

export type OrderOptionalProperties = Partial<{
    status: OrderStatus;
    parcels: Parcel[];
    updatedAt?: Date;
    version?: number;
    trackingNumber?: string;
    deliveryDate?: Date;
    feedback?: string;
    deliveryAddress?: string;
    paymentMethod?: string;
    specialInstructions?: string;
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

    deliver(): void {
        const clonedOrder = this.clone();
        if (!clonedOrder.isValidStatusChange(OrderStatus.Shipped, OrderStatus.Delivered)) {
            throw new UnprocessableEntityException(ErrorMessages.ORDER_NOT_IN_CREATED_STATE);
        }
        clonedOrder.orderData.status = OrderStatus.Delivered;
        clonedOrder.orderData.updatedAt = new Date();
    }

    cancel(): void {
        if (!this.isValidStatusChange(this.status, OrderStatus.Canceled)) {
            throw new UnprocessableEntityException(ErrorMessages.ORDER_NOT_CANCELABLE);
        }

        this.orderData.status = OrderStatus.Canceled;
        this.orderData.updatedAt = new Date();
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

    get data(): OrderData {
        return { ...this.orderData };
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

    get createdAt(): Date {
        return this.orderData.createdAt || new Date();
    }

    get updatedAt(): Date {
        return this.orderData.createdAt || new Date();
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
    Delivered = 'Delivered',
    Completed = 'Completed',
    Canceled = 'Canceled',
    Shipped = 'Shipped',
    Pending = 'Pending',
}

type CurrentStatus = OrderStatus;
type NextStatus = OrderStatus;

const VALID_STATUS_CHANGES: Record<CurrentStatus, NextStatus[]> = {
    [OrderStatus.Created]: [OrderStatus.Completed, OrderStatus.Canceled, OrderStatus.Shipped],
    [OrderStatus.Completed]: [],
    [OrderStatus.Delivered]: [OrderStatus.Completed, OrderStatus.Shipped],
    [OrderStatus.Canceled]: [],
    [OrderStatus.Shipped]: [OrderStatus.Delivered],
    [OrderStatus.Pending]: [],
};
