import { ShippingCost, ShippingCostCreateDate } from 'src/order/domain/shipping-cost/shipping-cost';
import { ShippingCostCommand } from '../../entity/shipping-cost/shipping-cost-command.entity';
import { HasMany } from 'src/libs/helpers/db-relationship.interface';
import { ParcelCommandMapper } from '../parcel/parcel-command.mapper';

export class ShippingCostCommandMapper {
    static toDomain(command: ShippingCostCommand): ShippingCost {
        const parcels = command.parcels
            ? HasMany.loaded(
                  command.parcels.map((parcel) => ParcelCommandMapper.toDomain(parcel)),
                  'shippingCost.parcels'
              )
            : HasMany.unloaded('shippingCost.parcels');

        return new ShippingCost({
            orderId: command.orderId,
            weight: command.weight,
            dimensions: command.dimensions,
            shippingOptions: command.shippingOptions,
            calculatedCost: command.calculatedCost,
            parcels,
        });
    }

    static toEntity(shippingCost: ShippingCostCreateDate): ShippingCostCommand {
        const command = new ShippingCostCommand();
        command.id = shippingCost.orderId;
        command.orderId = shippingCost.orderId;
        command.weight = shippingCost.weight;
        command.dimensions = shippingCost.dimensions;

        return command;
    }
}
