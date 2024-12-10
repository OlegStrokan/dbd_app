// parcel-query.mapper.ts
import { Parcel } from 'src/order/domain/parcel/parcel';
import { ParcelQuery } from '../../entity/parcel/query/parcel-query.entity';
import { OrderItemQueryMapper } from '../order-item/order-item-query.mapper';

export class ParcelQueryMapper {
    static toDomain(parcelQuery: ParcelQuery): Parcel {
        const items = parcelQuery.items?.map((item) => OrderItemQueryMapper.toDomain(item));
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
        return parcelQuery;
    }
}
