import { InternalServerErrorException } from '@nestjs/common';
import { IOrderItem, OrderItemProperties } from './order-item.interface';
import { AggregateRoot } from '@nestjs/cqrs';
import { ErrorMessages } from '../error-messages.enum';
import { generateUlid } from 'src/libs/generate-ulid';
import { IClone } from 'src/libs/helpers/clone.interface';

export class OrderItem extends AggregateRoot implements IOrderItem, IClone<OrderItem> {
    constructor(private orderItemData: OrderItemProperties) {
        super();
    }

    static generateOrderItemId = () => generateUlid();

    static create(properties: Omit<OrderItemProperties, 'id' | 'createdAt' | 'updatedAt'>): OrderItem {
        const orderItem = new OrderItem({
            id: generateUlid(),
            createdAt: new Date(),
            updatedAt: new Date(),
            ...properties,
        });

        return orderItem;
    }

    static createWithIdAndDate(properties: OrderItemProperties): OrderItem {
        const orderItem = new OrderItem({
            ...properties,
        });

        return orderItem;
    }

    clone(): OrderItem {
        return new OrderItem({
            ...this.orderItemData,
        });
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

    get data(): OrderItemProperties {
        return {
            ...this.orderItemData,
        };
    }

    compareId(id: string): boolean {
        return id === this.id;
    }

    updateQuantity(quantity: number): OrderItem {
        if (quantity <= 0) {
            throw new InternalServerErrorException(ErrorMessages.INVALID_ORDER_ITEM_QUANTITY);
        }

        const clonedData = this.clone();
        clonedData.orderItemData.quantity = quantity;

        return clonedData;
    }

    updatePrice(price: number): OrderItem {
        if (price < 0) {
            throw new InternalServerErrorException(ErrorMessages.INVALID_ORDER_ITEM_PRICE);
        }

        const clonedData = this.clone();
        clonedData.orderItemData.price = price;

        return clonedData;
    }
}
