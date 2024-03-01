import {Column, Generated, PrimaryColumn} from "typeorm";
import {SequenceColumn} from "../constants";

export abstract class ParcelEventEntity {
    @Column(SequenceColumn)
    @PrimaryColumn()
    @Generated()
    id: number;
}
