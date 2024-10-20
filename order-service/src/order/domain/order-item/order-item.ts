import { InternalServerErrorException } from '@nestjs/common';
import { IOrderItem, OrderItemProperties } from './order-item.interface';
import { AggregateRoot } from '@nestjs/cqrs';
import { ErrorMessages } from '../error-messages.enum';
import { OrderItemAddedEvent } from '../event/order-item-added.event';
import { OrderItemUpdatedEvent } from '../event/order-item-updated.event';

export class OrderItem extends AggregateRoot implements IOrderItem {
    constructor(private orderItemData: OrderItemProperties) {
        super();
    }

    static create(properties: OrderItemProperties): OrderItem {
        const orderItem = new OrderItem(properties);
        orderItem.apply(
            new OrderItemAddedEvent(properties.id, properties.productId, properties.quantity, properties.price)
        );
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

        // Clone the current state before update
        const clonedData = this.clone();
        clonedData.quantity = quantity;

        this.orderItemData = clonedData;
        this.apply(new OrderItemUpdatedEvent(this.id, this.productId, this.quantity, this.price));
    }

    updatePrice(price: number): void {
        if (price < 0) {
            throw new InternalServerErrorException(ErrorMessages.INVALID_ORDER_ITEM_PRICE);
        }

        // Clone the current state before update
        const clonedData = this.clone();
        clonedData.price = price;

        this.orderItemData = clonedData;
        this.apply(new OrderItemUpdatedEvent(this.id, this.productId, this.quantity, this.price));
    }

    commit(): void {
        this.apply(new OrderItemAddedEvent(this.id, this.productId, this.quantity, this.price));
    }
}
