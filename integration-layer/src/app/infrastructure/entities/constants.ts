import {ColumnOptions} from "typeorm";

export const SequenceColumn: ColumnOptions = {
    type: 'int',
    generated: true
}
