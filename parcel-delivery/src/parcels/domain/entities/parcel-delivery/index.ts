import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
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
}
