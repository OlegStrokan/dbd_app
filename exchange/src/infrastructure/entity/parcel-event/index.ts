import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("PARCEL_EVENT")
export class ParcelEvent {
  @PrimaryColumn()
  id: string;

  @Column()
  parcelNumber: string;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;
}
