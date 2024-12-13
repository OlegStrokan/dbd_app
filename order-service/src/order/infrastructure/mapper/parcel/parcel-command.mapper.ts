import { Parcel } from 'src/order/domain/parcel/parcel';
import { ParcelCommand } from '../../entity/parcel/command/parcel-command.entity';
import { OrderItemCommandMapper } from '../order-item/order-item-command.mapper';
import { HasMany } from 'src/libs/helpers/db-relationship.interface';

export class ParcelCommandMapper {
    static toDomain(parcelCommand: ParcelCommand): Parcel {
        const items = parcelCommand.items
            ? HasMany.loaded(
                  parcelCommand.items.map((item) => OrderItemCommandMapper.toDomain(item)),
                  'parcel.items'
              )
            : HasMany.unloaded('parcel.items');

        return new Parcel({
            ...parcelCommand,
            items,
        });
    }

    static toEntity(parcel: Parcel): ParcelCommand {
        const parcelCommand = new ParcelCommand();
        parcelCommand.id = parcel.id;
        parcelCommand.trackingNumber = parcel.trackingNumber;
        parcelCommand.weight = parcel.weight;
        parcelCommand.dimensions = parcel.dimensions;
        parcelCommand.orderId = parcel.orderId;

        if (parcel.parcel.items.isLoaded()) {
            parcelCommand.items = parcel.parcel.items.get().map((item) => OrderItemCommandMapper.toEntity(item));
        }

        return parcelCommand;
    }
}
