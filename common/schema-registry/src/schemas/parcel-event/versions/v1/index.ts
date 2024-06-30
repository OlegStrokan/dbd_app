import { ISO8601 } from "../../../types";
import * as avro from "avsc";

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
