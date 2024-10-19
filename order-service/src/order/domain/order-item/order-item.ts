import { InternalServerErrorException } from '@nestjs/common';
import { IOrderItem, OrderItemProperties } from './order-item.interface';
import { AggregateRoot } from '@nestjs/cqrs';
import { ErrorMessages } from '../error-messages.enum';
import { OrderItemAddedEvent } from '../event/order-item-added.event';
import { OrderItemUpdatedEvent } from '../event/order-item-updated.event';

export class OrderItem extends AggregateRoot implements IOrderItem {
    private readonly id: string;
    private readonly productId: string;
    private quantity: number;
    private price: number;
    private createdAt: Date;
    private updatedAt: Date;

    constructor(properties: OrderItemProperties) {
        super();
        Object.assign(this, properties);
        this.createdAt = properties.createdAt || new Date();
    }
    compareId(id: string): boolean {
        return id === this.id;
    }

    updateQuantity(quantity: number): void {
        if (quantity <= 0) {
            throw new InternalServerErrorException(ErrorMessages.INVALID_ORDER_ITEM_QUANTITY);
        }
        this.quantity = quantity;
        this.updatedAt = new Date();
        this.apply(new OrderItemUpdatedEvent(this.id, this.productId, this.quantity, this.price));
    }
    updatePrice(price: number): void {
        if (price < 0) {
            throw new InternalServerErrorException(ErrorMessages.INVALID_ORDER_ITEM_PRICE);
        }

        this.price = price;
        this.updatedAt = new Date();
        this.apply(new OrderItemUpdatedEvent(this.id, this.productId, this.quantity, this.price));
    }
    commit(): void {
        this.apply(new OrderItemAddedEvent(this.id, this.productId, this.quantity, this.price));
    }
}
