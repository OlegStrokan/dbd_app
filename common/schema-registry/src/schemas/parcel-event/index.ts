import { parcelEventV1 } from "./versions/v1";
import { parcelEventV2 } from "./versions/v2";
import { parcelEventV3 } from "./versions/v3";

export const parcelEventSchemas = {
  v1: {
    version: 1,
    schema: parcelEventV1,
  },
  v2: {
    version: 2,
    schema: parcelEventV2,
  },
  v3: {
    version: 3,
    schema: parcelEventV3,
  },
};
