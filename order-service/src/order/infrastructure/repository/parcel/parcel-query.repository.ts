import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/domain/order/order';
import { ParcelQuery } from '../../entity/parcel/query/parcel-query.entity';
import { Parcel } from 'src/order/domain/parcel/parcel';
import { ParcelQueryMapper } from '../../mapper/parcel/parcel-query.mapper';
import { OrderItem } from 'src/order/domain/order-item/order-item';
import { IParcelQueryRepository } from 'src/order/domain/parcel/parcel-query.repository';

@Injectable()
export class ParcelQueryRepository implements IParcelQueryRepository {
    constructor(
        @InjectRepository(ParcelQuery, 'queryConnection')
        private readonly parcelQueryRepository: Repository<ParcelQuery>
    ) {}

    public async findById(parcelId: string): Promise<Parcel | null> {
        const parcelEntity = await this.parcelQueryRepository.findOne({ where: { id: parcelId } });
        return ParcelQueryMapper.toDomain(parcelEntity);
    }

    public async insertMany(order: Order): Promise<void> {
        const parcels = Parcel.createParcels(order.id, order.items);
        await this.parcelQueryRepository.save(parcels);
    }
    public async insertOne(parcel: Parcel, item: OrderItem): Promise<void> {
        const newParcel = Parcel.addItem(parcel, item);
        await this.parcelQueryRepository.save(newParcel);
    }

    public async updateOne(orderId: string, updateData: Partial<Parcel>): Promise<void> {
        await this.parcelQueryRepository.update(orderId, updateData);
    }

    public async deleteOne(parcelId: string): Promise<void> {
        await this.parcelQueryRepository.delete(parcelId);
    }

    public async find(): Promise<Parcel[]> {
        const parcels = await this.parcelQueryRepository.find();
        return parcels.map((parcel) => ParcelQueryMapper.toDomain(parcel));
    }

    public async findOne(parcelId: string): Promise<Parcel> {
        const parcel = await this.parcelQueryRepository.findOneBy({ id: parcelId });
        return ParcelQueryMapper.toDomain(parcel);
    }
}
