import { parcelEventResolver } from "@stroka01/schema-registry/dist";

export const schemaResolvers = {
  v1: parcelEventResolver("v1"),
  v2: parcelEventResolver("v2"),
};
