import { Logger, Module } from "@nestjs/common";
import { DecodingDataService } from "./decoding-data.service";
import { AVAILABLE_SCHEMAS } from "./schemas";

@Module({
  providers: [
    {
      provide: DecodingDataService,
      useFactory: () => {
        const schemaVersion = AVAILABLE_SCHEMAS.V1;
        return new DecodingDataService(schemaVersion);
      },
    },
    Logger,
  ],
  exports: [DecodingDataService, Logger],
})
export class DecodingDataModule {}
