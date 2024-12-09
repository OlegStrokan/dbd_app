import { generateUlid } from 'src/libs/generate-ulid';
import { OrderItem } from '../order-item/order-item';

export type ParcelData = {
    id: string;
    trackingNumber: string;
    weight: number;
    dimensions: string;
    orderId: string;
    items: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
};
export class Parcel {
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

    get items(): OrderItem[] {
        return this.parcel.items;
    }

    static createWithIdAndDate(parcelData: ParcelData): Parcel {
        return new Parcel({
            ...parcelData,
        });
    }
    static addItem(parcelItem: Parcel, item: OrderItem): Parcel {
        if (!item) {
            throw new Error('Invalid Order Item');
        }

        return new Parcel({
            id: generateUlid(),
            ...parcelItem.parcel,
            weight: parcelItem.parcel.weight + item.weight,
            items: [...parcelItem.parcel.items, item],
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
                    trackingNumber: this.generateTrackingNumber(),
                    weight: item.weight,
                    dimensions: LARGE_ITEM_DIMENSIONS,
                    orderId,
                    items,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                currentParcel = this.addItem(currentParcel, item);
            } else {
                if (!currentParcel || currentParcel.parcel.weight + item.weight > MAX_PARCEL_WEIGHT) {
                    currentParcel = new Parcel({
                        id: generateUlid(),
                        trackingNumber: this.generateTrackingNumber(),
                        dimensions: SMALL_ITEM_DIMENSIONS,
                        orderId,
                        items,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        weight: item.weight,
                    });
                    parcels.push(currentParcel);
                }
                currentParcel = this.addItem(currentParcel, item);
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
}
const MAX_PARCEL_WEIGHT = 10;
const MAX_SINGLE_ITEM_WEIGHT = 5;

const SMALL_ITEM_DIMENSIONS = '10x10x10';
const LARGE_ITEM_DIMENSIONS = '50x50x50';
