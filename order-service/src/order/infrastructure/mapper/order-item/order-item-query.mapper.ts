// order-item-query.mapper.ts
import { OrderItem } from 'src/order/domain/order-item/order-item';
import { OrderItemQuery } from '../../entity/order-item/query/order-item-query.entity';

export class OrderItemQueryMapper {
    static toDomain(itemQuery: OrderItemQuery): OrderItem {
        return new OrderItem({
            id: itemQuery.id,
            productId: itemQuery.productId,
            quantity: itemQuery.quantity,
            price: itemQuery.price,
            weight: itemQuery.weight,
            createdAt: itemQuery.createdAt,
            updatedAt: itemQuery.updatedAt,
        });
    }

    static toEntity(item: OrderItem): OrderItemQuery {
        const itemQuery = new OrderItemQuery();
        itemQuery.id = item.id;
        itemQuery.productId = item.productId;
        itemQuery.quantity = item.quantity;
        itemQuery.price = item.price;
        itemQuery.weight = item.weight;
        return itemQuery;
    }
}
