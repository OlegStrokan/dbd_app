"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcelEventV1 = void 0;
const avro = require("avsc");
exports.parcelEventV1 = avro.Type.forSchema({
    type: "record",
    name: "ParcelEvent",
    fields: [
        { name: "id", type: "string" },
        { name: "parcelNumber", type: "string" },
    ],
});
//# sourceMappingURL=index.js.map