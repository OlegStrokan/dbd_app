import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("log")
export class Log {
  constructor(init?: Partial<Log>) {
    Object.assign(this, init);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  lastConsumedAt: string;
}
