// parcel-query.mapper.ts
import { Parcel } from 'src/order/domain/parcel/parcel';
import { OrderItemQueryMapper } from '../order-item/order-item-query.mapper';
import { HasMany } from 'src/libs/helpers/db-relationship.interface';
import { ParcelQuery } from '../../entity/parcel/parcel-query.entity';

export class ParcelQueryMapper {
    static toDomain(parcelQuery: ParcelQuery): Parcel {
        const items = parcelQuery.items
            ? HasMany.loaded(
                  parcelQuery.items.map((item) => OrderItemQueryMapper.toDomain(item)),
                  'parcel.items'
              )
            : HasMany.unloaded('parcel.items');

        return new Parcel({
            ...parcelQuery,
            items,
        });
    }

    static toEntity(parcel: Parcel): ParcelQuery {
        const parcelQuery = new ParcelQuery();
        parcelQuery.id = parcel.id;
        parcelQuery.trackingNumber = parcel.trackingNumber;
        parcelQuery.weight = parcel.weight;
        parcelQuery.dimensions = parcel.dimensions;
        parcelQuery.orderId = parcel.orderId;

        if (parcel.parcel.items.isLoaded()) {
            parcelQuery.items = parcel.parcel.items.get().map((item) => OrderItemQueryMapper.toEntity(item));
        }

        return parcelQuery;
    }
}
