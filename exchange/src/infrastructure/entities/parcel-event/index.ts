// parcel.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class ParcelEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  parcelNumber: number;
}
