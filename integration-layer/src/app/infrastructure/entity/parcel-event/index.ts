import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("parcel_events")
export class ParcelEvent {
  constructor(init?: Partial<ParcelEvent>) {
    Object.assign(this, init);
  }
  @PrimaryColumn({ type: "varchar" })
  id: string;

  @Column({ type: "varchar" })
  parcel_number: string;

  @Column({ type: "varchar" })
  created_at: string;

  @Column({ type: "varchar" })
  updated_at: string;

  @Column({ type: "float" })
  weight: number;
}
