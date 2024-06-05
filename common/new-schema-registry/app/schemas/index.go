package schemas

import (
	"github.com/linkedin/goavro/v2"
	"log"
	v1 "new-schema-registry/app/schemas/parcel-event/versions/v1"
)

type Schema struct {
	Version int
	Schema  *goavro.Codec
}

type AvailableSchemas map[string]map[string]Schema

var SCHEMAS = make(AvailableSchemas)

func init() {
	schemaV1, err := v1.CreateSchema()
	if err != nil {
		log.Fatalln("Failed to create v1 schema: %v", err)
	}
	SCHEMAS["parcelEvent"] = map[string]Schema{
		"v1": schemaV1,
	}
}
