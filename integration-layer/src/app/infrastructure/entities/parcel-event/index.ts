// parcel.ts
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm";

@Entity("PARCEL_EVENT")
export class ParcelEvent {
  @PrimaryColumn({ type: "varchar" })
  id: string;

  @Column({ type: "varchar" })
  parcelNumber: string;

  @Column({ type: "varchar" })
  createdAt: string;

  @Column({ type: "varchar" })
  updatedAt: string;
}
