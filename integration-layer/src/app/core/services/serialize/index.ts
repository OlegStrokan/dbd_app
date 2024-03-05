import { Type } from 'avsc';
import {ISerializeService} from "@root/src/app/core/services/serialize/inteface";

export class AvroSerializeService implements ISerializeService {
    private schema: Type;

    constructor(schema: Type) {
        this.schema = schema;
    }

    serialize(data: any): Buffer {
        return this.schema.toBuffer(data);
    }

    deserialize<T>(buffer: Buffer): T {
        return this.schema.fromBuffer(buffer);
    }
}
