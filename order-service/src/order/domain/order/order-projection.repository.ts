import { OrderProjection } from 'src/order/infrastructure/entity/order/order-projection.entity';

export interface IOrderProjectionRepository {
    insertOne(orderProjection: Partial<OrderProjection>): Promise<void>;
    updateOne(orderProjection: Partial<OrderProjection>): Promise<void>;
    findById(id: string): Promise<OrderProjection | undefined>;
    findAll(): Promise<OrderProjection[]>;
    deleteById(id: string): Promise<void>;
}
