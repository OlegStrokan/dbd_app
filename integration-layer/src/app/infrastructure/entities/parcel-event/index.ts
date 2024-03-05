import {Column, Generated, PrimaryColumn} from "typeorm";

export abstract class ParcelEventEntity {
    @Column({ type: "int", generated: true })
    @PrimaryColumn()
    @Generated()
    id: number;


    @Column({ type: 'nvarchar', length: 255 })
    parcelNumber: string

    @Column({ type: 'datetime', nullable: false })
    createdAt: Date

    @Column({ type: 'datetime', nullable: false })
    updatedAt: Date

    @Column({ type: "nvarchar", length: 100, nullable: true })
    note: string | null

}
