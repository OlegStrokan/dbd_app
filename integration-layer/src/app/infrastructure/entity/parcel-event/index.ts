import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("parcel_event")
export class ParcelEvent {
  constructor(init?: Partial<ParcelEvent>) {
    Object.assign(this, init);
  }
  @PrimaryColumn({ type: "varchar" })
  id: string;

  @Column({ type: "varchar" })
  parcelNumber: string;

  @Column({ type: "varchar" })
  createdAt: string;

  @Column({ type: "varchar" })
  updatedAt: string;

  @Column({ type: "float" })
  weight: number;
}
