export type OrderItemEssentialProperties = Readonly<
  Required<{
    id: string;
    productId: string;
    quantity: number;
    price: number;
  }>
>;

export type OrderItemOptionalProperties = Readonly<
  Partial<{ createdAt: Date; updatedAt: Date }>
>;

export type OrderItemProperties = OrderItemEssentialProperties &
  Required<OrderItemOptionalProperties>;

export interface IOrderItem {
  compareId: (id: string) => boolean;
  updateQuantity: (quantity: number) => void;
  updatePrice: (price: number) => void;
  commit: () => void;
}
