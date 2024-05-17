import { parcelEventResolver } from "@common/schema-registry/src";

export const schemaResolvers = {
  v1: parcelEventResolver("v1"),
  v2: parcelEventResolver("v2"),
};
