import { ShippingCost } from 'src/order/domain/shipping-cost/shipping-cost';
import { ParcelQueryMapper } from '../parcel/parcel-query.mapper';
import { HasMany } from 'src/libs/helpers/db-relationship.interface';
import { ShippingCostQuery } from '../../entity/shipping-cost/shipping-cost-query.entity';

export class ShippingCostQueryMapper {
    static toDomain(shippingCostQuery: ShippingCostQuery): ShippingCost {
        const parcels = shippingCostQuery.parcels
            ? HasMany.loaded(
                  shippingCostQuery.parcels.map((parcel) => ParcelQueryMapper.toDomain(parcel)),
                  'shippingCost.parcels'
              )
            : HasMany.unloaded('shippingCost.parcels');

        return new ShippingCost({
            orderId: shippingCostQuery.orderId,
            weight: 0,
            dimensions: { length: 0, width: 0, height: 0 },
            shippingOptions: { expressDelivery: false, fragileHandling: false, insurance: false },
            calculatedCost: shippingCostQuery.calculatedCost,
            parcels,
        });
    }

    static toEntity(shippingCost: ShippingCost): ShippingCostQuery {
        const shippingCostQuery = new ShippingCostQuery();
        shippingCostQuery.id = shippingCost.shippingCostData.orderId;
        shippingCostQuery.orderId = shippingCost.shippingCostData.orderId;
        shippingCostQuery.calculatedCost = shippingCost.shippingCostData.calculatedCost;

        if (shippingCost.shippingCostData.parcels.isLoaded()) {
            shippingCostQuery.parcels = shippingCost.shippingCostData.parcels
                .get()
                .map((parcel) => ParcelQueryMapper.toEntity(parcel));
        }

        return shippingCostQuery;
    }
}
