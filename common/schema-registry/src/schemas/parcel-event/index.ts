import { parcelEventV1 } from "./versions/v1";
import { parcelEventV2 } from "./versions/v2";

export const parcelEventSchemas = {
  v1: {
    version: 1,
    schema: parcelEventV1,
  },
  v2: {
    version: 2,
    schema: parcelEventV2,
  },
};
