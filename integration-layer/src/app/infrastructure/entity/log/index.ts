import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("log")
export class Log {
  constructor(init?: Partial<Log>) {
    Object.assign(this, init);
  }
  @PrimaryColumn({ type: "varchar" })
  id: string;

  @Column({ type: "varchar" })
  lastConsumedAt: string;
}
