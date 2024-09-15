import { Injectable, Logger } from "@nestjs/common";
import { schemaResolvers } from "@app/parcel-delivery/resolver/avro-schema";

@Injectable()
export class DecodingDataService {
  private readonly logger = new Logger(DecodingDataService.name);
  private readonly decodeSchemaVersion: string;

  constructor(decodeSchemaVersion: string) {
    this.decodeSchemaVersion = decodeSchemaVersion;
  }

  decodeEvent(buffer: Uint8Array) {
    const schemaResolver = schemaResolvers[this.decodeSchemaVersion];
    if (!schemaResolver) {
      throw new Error(
        "Schema resolver not found for version: " + this.decodeSchemaVersion
      );
    }

    try {
      const { schema } = schemaResolver;
      return schema.fromBuffer(buffer);
    } catch (error) {
      this.logger.error(`Error decoding buffer: ${error.message}`, error.stack);
      throw new Error("Error decoding buffer");
    }
  }

  encodeEvent(buffer: any): Uint8Array {
    const schemaResolver = schemaResolvers[this.decodeSchemaVersion];
    if (!schemaResolver) {
      throw new Error(
        "Schema resolver not found for version: " + this.decodeSchemaVersion
      );
    }

    try {
      const { schema } = schemaResolver;
      return schema.toBuffer(buffer);
    } catch (error) {
      this.logger.error(`Error encoding buffer: ${error.message}`, error.stack);
      throw new Error("Error encoding buffer");
    }
  }
}
