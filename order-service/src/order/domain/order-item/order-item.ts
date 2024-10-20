import { InternalServerErrorException } from '@nestjs/common';
import { IOrderItem, OrderItemProperties } from './order-item.interface';
import { AggregateRoot } from '@nestjs/cqrs';
import { ErrorMessages } from '../error-messages.enum';
import { OrderItemAddedEvent } from '../event/order-item-added.event';
import { OrderItemUpdatedEvent } from '../event/order-item-updated.event';

export class OrderItem extends AggregateRoot implements IOrderItem {
    private orderItemData: OrderItemProperties;

    constructor(properties: OrderItemProperties) {
        super();
        this.orderItemData = {
            id: properties.id,
            productId: properties.productId,
            quantity: properties.quantity || 0,
            price: properties.price || 0,
            createdAt: properties.createdAt || new Date(),
            updatedAt: properties.updatedAt || new Date(),
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
        this.orderItemData.quantity = quantity;
        this.orderItemData.updatedAt = new Date();
        this.apply(new OrderItemUpdatedEvent(this.id, this.productId, this.quantity, this.price));
    }

    updatePrice(price: number): void {
        if (price < 0) {
            throw new InternalServerErrorException(ErrorMessages.INVALID_ORDER_ITEM_PRICE);
        }
        this.orderItemData.price = price;
        this.orderItemData.updatedAt = new Date();
        this.apply(new OrderItemUpdatedEvent(this.id, this.productId, this.quantity, this.price));
    }

    commit(): void {
        this.apply(new OrderItemAddedEvent(this.id, this.productId, this.quantity, this.price));
    }
}
