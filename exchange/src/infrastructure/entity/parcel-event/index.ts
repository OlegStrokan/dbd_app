import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("parcel_event")
export class ParcelEvent {
  @PrimaryColumn("varchar", { length: 36 })
  id: string;

  @Column("varchar", { length: 36 })
  parcelNumber: string;

  @Column("varchar")
  createdAt: string;

  @Column("varchar")
  updatedAt: string;

  @Column({ type: "float" })
  weight: number;
}
