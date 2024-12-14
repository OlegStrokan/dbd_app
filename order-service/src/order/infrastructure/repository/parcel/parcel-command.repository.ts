// parcel-command.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParcelCommand } from '../../entity/parcel/parcel-command.entity';
import { Repository } from 'typeorm';
import { IParcelCommandRepository } from 'src/order/domain/parcel/parcel-command.repository';
import { Parcel } from 'src/order/domain/parcel/parcel';
import { Order } from 'src/order/domain/order/order';
import { OrderItem } from 'src/order/domain/order-item/order-item';

@Injectable()
export class ParcelCommandRepository implements IParcelCommandRepository {
    constructor(
        @InjectRepository(ParcelCommand, 'commandConnection')
        private readonly parcelRepository: Repository<ParcelCommand>
    ) {}
    public async insertMany(order: Order): Promise<void> {
        const parcels = Parcel.createParcels(order.id, order.items);
        await this.parcelRepository.save(parcels);
    }
    public async insertOne(parcel: Parcel, item: OrderItem): Promise<void> {
        const newParcel = Parcel.addItem(parcel, item);
        await this.parcelRepository.save(newParcel);
    }
    public async updateOne(parcel: Parcel): Promise<void> {
        await this.parcelRepository.update(parcel.id, parcel);
    }
    public async deleteOne(parcelId: string): Promise<void> {
        await this.parcelRepository.delete(parcelId);
    }
}
