// import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ParcelDelivery } from "../../../core/entities/parcel-delivery";

// @ObjectType()
@Entity({ name: "parcel-delivery" })
export class ParcelDeliveryEntity {
  //  @Field(() => String, { description: 'Unique identifier' })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // @Field(() => String, { description: 'Parcel number' })
  @Column()
  parcelNumber: string;

  // @Field(() => String, { description: 'Parcel name' })

  toCoreEntity(): ParcelDelivery {
    return new ParcelDelivery({
      id: this.id,
      parcelNumber: this.parcelNumber,
    });
  }

  static fromCoreEntity(coreEntity: ParcelDelivery): ParcelDeliveryEntity {
    const entity = new ParcelDeliveryEntity();
    entity.id = coreEntity.data.id;
    entity.parcelNumber = coreEntity.data.parcelNumber;
    return entity;
  }
}
