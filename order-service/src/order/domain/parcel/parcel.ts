import { InternalServerErrorException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { generateUlid } from 'src/libs/generate-ulid';
import { IClone } from 'src/libs/helpers/clone.interface';
import { HasMany } from 'src/libs/helpers/db-relationship.interface';
import { OrderItem } from '../order-item/order-item';
import { Dimension } from '../shipping-cost/shipping-cost';

export type ParcelData = {
    id: string;
    trackingNumber: string;
    weight: number;
    dimensions: Dimension;
    orderId: string;
    items: HasMany<OrderItem>;
    createdAt: Date;
    updatedAt?: Date;
};
export class Parcel extends AggregateRoot implements IClone<Parcel> {
    constructor(private parcelData: ParcelData) {
        super();
    }

    get id(): string {
        return this.parcelData.id;
    }

    get trackingNumber(): string {
        return this.parcelData.trackingNumber;
    }

    get data(): ParcelData {
        return this.parcelData;
    }

    get weight(): number {
        return this.parcelData.weight;
    }

    get dimensions(): Dimension {
        return this.parcelData.dimensions;
    }

    get orderId(): string {
        return this.parcelData.orderId;
    }

    get createdAt(): Date {
        return this.parcelData.createdAt;
    }

    get updatedAt(): Date {
        return this.parcelData.updatedAt || this.parcelData.createdAt;
    }

    static create(parcelData: Omit<ParcelData, 'id' | 'createdAt' | 'trackingNumber'>): Parcel {
        const parcel = new Parcel({
            ...parcelData,
            id: generateUlid(),
            createdAt: new Date(),
            updatedAt: new Date(),
            trackingNumber: this.generateTrackingNumber(),
        });
        return parcel;
    }

    static generateTrackingNumber(): string {
        return 'TRACK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    addItem(item: OrderItem): Parcel {
        if (!item) {
            throw new InternalServerErrorException('Invalid Order Item');
        }

        const clonedParcel = this.clone();
        const loadedItems = clonedParcel.parcelData.items.isLoaded() ? clonedParcel.parcelData.items.get() : [];

        clonedParcel.parcelData.items = HasMany.loaded([...loadedItems, item], 'parcel.items');
        clonedParcel.parcelData.weight += item.weight;
        clonedParcel.parcelData.updatedAt = new Date();

        return clonedParcel;
    }

    updateTrackingInfo(trackingNumber: string): Parcel {
        const clonedParcel = this.clone();
        clonedParcel.parcelData.trackingNumber = trackingNumber;
        clonedParcel.parcelData.updatedAt = new Date();
        return clonedParcel;
    }

    setDimensions(dimensions: Dimension): Parcel {
        const clonedParcel = this.clone();
        clonedParcel.parcelData.dimensions = dimensions;
        clonedParcel.parcelData.updatedAt = new Date();
        return clonedParcel;
    }

    loadOrderItems(orderItems: OrderItem[]): Parcel {
        const clonedParcel = this.clone();
        clonedParcel.parcelData.items = HasMany.loaded(orderItems, 'parcel.items');
        clonedParcel.parcelData.updatedAt = new Date();
        return clonedParcel;
    }

    clone(): Parcel {
        return new Parcel({ ...this.parcelData });
    }
}
