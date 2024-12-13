import { generateUlid } from 'src/libs/generate-ulid';
import { OrderItem } from '../order-item/order-item';
import { HasMany } from 'src/libs/helpers/db-relationship.interface';
import { IClone } from 'src/libs/helpers/clone.interface';

export type ParcelData = {
    id: string;
    trackingNumber: string;
    weight: number;
    dimensions: string;
    orderId: string;
    items: HasMany<OrderItem>;
    createdAt: Date;
    updatedAt: Date;
};

export class Parcel implements IClone<Parcel> {
    constructor(public readonly parcel: ParcelData) {}

    get id(): string {
        return this.parcel.id;
    }

    get trackingNumber(): string {
        return this.parcel.trackingNumber;
    }

    get weight(): number {
        return this.parcel.weight;
    }

    get dimensions(): string {
        return this.parcel.dimensions;
    }

    get orderId(): string {
        return this.parcel.orderId;
    }

    static createWithIdAndDate(parcelData: Omit<ParcelData, 'id' | 'createdAt' | 'updatedAt'>): Parcel {
        return new Parcel({
            ...parcelData,
            id: generateUlid(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static addItem(parcel: Parcel, item: OrderItem): Parcel {
        if (!item) {
            throw new Error('Invalid Order Item');
        }

        const loadedItems = parcel.parcel.items.isLoaded() ? parcel.parcel.items.get() : [];

        return new Parcel({
            ...parcel.parcel,
            weight: parcel.parcel.weight + item.weight,
            items: HasMany.loaded([...loadedItems, item], 'parcel.items'),
            updatedAt: new Date(),
        });
    }

    static createParcels(orderId: string, items: OrderItem[]): Parcel[] {
        const parcels: Parcel[] = [];
        let currentParcel: Parcel | null = null;

        for (const item of items) {
            const isLargeItem = item.weight > MAX_SINGLE_ITEM_WEIGHT;

            if (isLargeItem) {
                if (currentParcel) {
                    parcels.push(currentParcel);
                }

                currentParcel = new Parcel({
                    id: generateUlid(),
                    trackingNumber: Parcel.generateTrackingNumber(),
                    weight: item.weight,
                    dimensions: LARGE_ITEM_DIMENSIONS,
                    orderId,
                    items: HasMany.loaded([item], 'parcel.items'),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                parcels.push(currentParcel);
                currentParcel = null;
            } else {
                if (!currentParcel || currentParcel.parcel.weight + item.weight > MAX_PARCEL_WEIGHT) {
                    if (currentParcel) {
                        parcels.push(currentParcel);
                    }

                    currentParcel = new Parcel({
                        id: generateUlid(),
                        trackingNumber: Parcel.generateTrackingNumber(),
                        dimensions: SMALL_ITEM_DIMENSIONS,
                        orderId,
                        items: HasMany.loaded([item], 'parcel.items'),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        weight: 0,
                    });
                }
                currentParcel = Parcel.addItem(currentParcel, item);
            }
        }

        if (currentParcel) {
            parcels.push(currentParcel);
        }

        return parcels;
    }

    static generateTrackingNumber(): string {
        return 'TRACK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    loadOrderItems(orderItems: OrderItem[]): Parcel {
        const clone = this.clone();
        clone.parcel.items = HasMany.loaded(orderItems, 'parcel.orderItems');
        return clone;
    }

    clone(): Parcel {
        return new Parcel({ ...this.parcel });
    }
}

const MAX_PARCEL_WEIGHT = 10;
const MAX_SINGLE_ITEM_WEIGHT = 5;
const SMALL_ITEM_DIMENSIONS = '10x10x10';
const LARGE_ITEM_DIMENSIONS = '50x50x50';
