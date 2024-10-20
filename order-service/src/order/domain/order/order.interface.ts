import { OrderItem } from '../order-item/order-item';

export interface IOrder {
    compareId: (id: string) => boolean;
    create: () => void;
    cancel: () => void;
    ship: (trackingNumber: string, deliveryDate: Date) => void;
    addItem: (item: OrderItem) => void;
    commit: () => void;
}
