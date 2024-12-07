import { generateUlid } from 'src/libs/generate-ulid';
import { OrderItem } from '../order-item/order-item';

export class Parcel {
    constructor(
        public id: string,
        public trackingNumber: string,
        public weight: number,
        public dimensions: string,
        public orderId: string,
        public items: OrderItem[] = []
    ) {}

    static addItem(parcel: Parcel, item: OrderItem): Parcel {
        if (!item) {
            throw new Error('Invalid Order Item');
        }

        return new Parcel(
            generateUlid(),
            parcel.trackingNumber,
            parcel.weight + item.weight,
            parcel.dimensions,
            parcel.orderId,
            [...parcel.items, item]
        );
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

                currentParcel = new Parcel(
                    generateUlid(),
                    this.generateTrackingNumber(),
                    item.weight,
                    LARGE_ITEM_DIMENSIONS,
                    orderId
                );
                currentParcel = this.addItem(currentParcel, item);
            } else {
                if (!currentParcel || currentParcel.weight + item.weight > MAX_PARCEL_WEIGHT) {
                    currentParcel = new Parcel(
                        generateUlid(),
                        this.generateTrackingNumber(),
                        0,
                        SMALL_ITEM_DIMENSIONS,
                        orderId
                    );
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
