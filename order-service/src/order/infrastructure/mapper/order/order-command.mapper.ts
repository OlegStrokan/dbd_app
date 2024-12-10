import { OrderItem } from 'src/order/domain/order-item/order-item';
import { OrderStatusMapper } from '../order-status.mapper';
import { OrderItemCommand } from '../../entity/order-item/command/order-item-command.entity';
import { Order } from 'src/order/domain/order/order';
import { OrderCommand } from '../../entity/order/order-command.entity';

export class OrderCommandMapper {
    static toDomain(orderCommand: OrderCommand): Order {
        const orderData = {
            id: orderCommand.id,
            customerId: orderCommand.customerId,
            totalAmount: orderCommand.totalAmount,
            createdAt: orderCommand.createdAt,
            updatedAt: orderCommand.updatedAt,
            status: OrderStatusMapper.fromDatabase(orderCommand.status),
            deliveryAddress: orderCommand.deliveryAddress,
            paymentMethod: orderCommand.paymentMethod,
            specialInstructions: orderCommand.specialInstructions,
            items: orderCommand.items.map((item) => OrderCommandMapper.toDomainItem(item)),
        };
        return Order.createWithId(orderData);
    }

    static toDomainItem(itemCommand: OrderItemCommand): OrderItem {
        return new OrderItem({
            id: itemCommand.id,
            productId: itemCommand.productId,
            quantity: itemCommand.quantity,
            price: itemCommand.price,
            weight: itemCommand.weight,
            createdAt: itemCommand.createdAt,
            updatedAt: itemCommand.updatedAt,
        });
    }

    static toEntity(order: Order): OrderCommand {
        const orderCommand = new OrderCommand();
        orderCommand.id = order.id;
        orderCommand.customerId = order.customerId;
        orderCommand.totalAmount = order.totalAmount;
        orderCommand.createdAt = order.createdAt;
        orderCommand.updatedAt = order.updatedAt;
        orderCommand.status = order.status;
        orderCommand.deliveryAddress = order.deliveryAddress;
        orderCommand.paymentMethod = order.paymentMethod;
        orderCommand.specialInstructions = order.specialInstruction;
        // TODO add order.feedback
        orderCommand.items = order.items.map((item) => OrderCommandMapper.toEntityItem(item));
        return orderCommand;
    }

    static toEntityItem(item: OrderItem): OrderItemCommand {
        const itemCommand = new OrderItemCommand();
        itemCommand.productId = item.productId;
        itemCommand.quantity = item.quantity;
        itemCommand.price = item.price;
        return itemCommand;
    }
}
