package resolvers

import (
	"github.com/linkedin/goavro/v2"
	"log"
	"new-schema-registry/app/schemas"
)

func GetParcelSchemaResolver(version string) *goavro.Codec {
	schema, ok := schemas.SCHEMAS["parcelEvent"][version]
	if !ok {
		log.Fatalf("Schema version %s not found", version)
	}
	return schema.Schema
}
