import { ISO8601 } from "@root/src/schemas/types";
import * as avro from "avsc";

export const parcelEventV3 = avro.Type.forSchema({
  type: "record",
  name: "ParcelEvent",
  fields: [
    { name: "id", type: "string" },
    { name: "parcelNumber", type: "string" },
    { name: "createdAt", type: ISO8601 },
    { name: "updatedAt", type: ISO8601 },
    { name: "weight", type: "float" },
    {
      name: "statusHistory",
      type: {
        type: "array",
        items: "string",
      },
    },
  ],
});
