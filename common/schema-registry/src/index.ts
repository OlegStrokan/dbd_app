import { AvailableSchemas, createResolver } from "./resolver";
export * from "./resolver";
export * from "./schemas";

type ParcelEventVersions = keyof AvailableSchemas["parcelEvent"];
export const parcelEventResolver = createResolver<
  "parcelEvent",
  ParcelEventVersions[]
>("parcelEvent", ["v1", "v2"]);
