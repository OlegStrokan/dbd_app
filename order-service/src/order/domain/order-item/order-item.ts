import { InternalServerErrorException } from '@nestjs/common';
import { IOrderItem, OrderItemProperties } from './order-item.interface';
import { AggregateRoot } from '@nestjs/cqrs';
import { ErrorMessages } from '../error-messages.enum';
import { OrderItemAddedEvent } from '../event/order-item/order-item-added.event';
import { OrderItemUpdatedEvent } from '../event/order-item/order-item-updated.event';
import { generateUlid } from 'src/libs/generate-ulid';

export class OrderItem extends AggregateRoot implements IOrderItem {
    constructor(private orderItemData: OrderItemProperties) {
        super();
    }

    static generateOrderItemId = () => generateUlid();

    static create(properties: Omit<OrderItemProperties, 'id'>): OrderItem {
        const orderItem = new OrderItem({
            id: generateUlid(),
            ...properties,
        });
        return orderItem;
    }

    private clone(): OrderItemProperties {
        return {
            ...this.orderItemData,
            updatedAt: new Date(),
        };
    }

    get id(): string {
        return this.orderItemData.id;
    }

    get productId(): string {
        return this.orderItemData.productId;
    }

    get quantity(): number {
        return this.orderItemData.quantity;
    }

    get price(): number {
        return this.orderItemData.price;
    }

    get weight(): number {
        return this.orderItemData.weight;
    }

    get createdAt(): Date {
        return this.orderItemData.createdAt;
    }

    get updatedAt(): Date {
        return this.orderItemData.updatedAt;
    }

    compareId(id: string): boolean {
        return id === this.id;
    }

    updateQuantity(quantity: number): void {
        if (quantity <= 0) {
            throw new InternalServerErrorException(ErrorMessages.INVALID_ORDER_ITEM_QUANTITY);
        }

        const clonedData = this.clone();
        clonedData.quantity = quantity;

        this.orderItemData = clonedData;
        this.apply(new OrderItemUpdatedEvent(this.id, this.productId, this.quantity, this.price, this.weight));
    }

    updatePrice(price: number): void {
        if (price < 0) {
            throw new InternalServerErrorException(ErrorMessages.INVALID_ORDER_ITEM_PRICE);
        }

        const clonedData = this.clone();
        clonedData.price = price;

        this.orderItemData = clonedData;
        this.apply(new OrderItemUpdatedEvent(this.id, this.productId, this.quantity, this.price, this.weight));
    }

    commit(): void {
        this.apply(new OrderItemAddedEvent(this.id, this.productId, this.quantity, this.price, this.weight));
    }
}
