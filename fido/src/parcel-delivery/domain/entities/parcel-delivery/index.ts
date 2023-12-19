import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ParcelDelivery } from "../../../core/entities/parcel-delivery.entity";

@ObjectType()
@Entity({ name: "parcel-deliveries"})
export class ParcelDeliveryEntity {
  @Field(() => Int, { description: 'Unique identifier' })
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Field(() => Int, { description: 'Parcel number' })
  @Column()
  parcelNumber: number;

  @Field(() => String, { description: 'Parcel name' })
  @Column()
  name: string;

  toCoreEntity(): ParcelDelivery {
    return new ParcelDelivery({
      id: this.id,
      name: this.name,
      parcelNumber: this.parcelNumber
    });
  }

  static fromCoreEntity(coreEntity: ParcelDelivery): ParcelDeliveryEntity {
    const entity = new ParcelDeliveryEntity();
    entity.id = coreEntity.data.id;
    entity.name = coreEntity.data.name;
    entity.parcelNumber = coreEntity.data.parcelNumber;
    return entity;
  }
}
