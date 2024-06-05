package schemas

import (
	"log"
	v1 "new-schema-registry/app/schemas/parcel-event/versions/v1"
	v2 "new-schema-registry/app/schemas/parcel-event/versions/v2"
	. "new-schema-registry/app/schemas/utils"
)

var SCHEMAS = make(AvailableSchemas)

func InitSchemas() AvailableSchemas {
	schemaV1, err := v1.CreateSchema()
	if err != nil {
		log.Fatalf("Failed to create v1 schema: %v\n", err)
	}
	schemaV2, err := v2.CreateSchema()
	if err != nil {
		log.Fatalf("Failed to create v2 schema: %v\n", err)

	}
	SCHEMAS["parcelEvent"] = map[string]Schema{
		"v1": schemaV1,
		"v2": schemaV2,
	}

	return SCHEMAS
}
