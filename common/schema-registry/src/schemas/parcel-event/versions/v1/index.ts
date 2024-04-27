import * as avro from "avsc";

export const ISO8601: avro.schema.ComplexType = {
  type: "string",
};

export const parcelEventV1 = avro.Type.forSchema({
  type: "record",
  name: "ParcelEvent",
  fields: [
    { name: "id", type: "string" },
    { name: "parcelNumber", type: "string" },
    { name: "createdAt", type: ISO8601 },
    { name: "updatedAt", type: ISO8601 },
  ],
});
