import { ShippingCost } from 'src/order/domain/shipping-cost/shipping-cost';
import { ShippingCostCommand } from '../../entity/shipping-cost/shipping-cost-command.entity';

export class ShippingCostCommandMapper {
    static toDomain(command: ShippingCostCommand): ShippingCost {
        return new ShippingCost({
            orderId: command.orderId,
            weight: command.weight,
            dimensions: command.dimensions,
            shippingOptions: command.shippingOptions,
            calculatedCost: command.calculatedCost,
        });
    }

    static toEntity(shippingCost: ShippingCost): ShippingCostCommand {
        const command = new ShippingCostCommand();
        command.id = shippingCost.data.orderId;
        command.orderId = shippingCost.data.orderId;
        command.weight = shippingCost.data.weight;
        command.dimensions = shippingCost.data.dimensions;
        command.shippingOptions = shippingCost.data.shippingOptions;
        command.calculatedCost = shippingCost.data.calculatedCost;

        return command;
    }
}
