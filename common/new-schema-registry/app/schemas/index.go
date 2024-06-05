package schemas

import (
	"github.com/linkedin/goavro/v2"
	v1 "new-schema-registry/app/schemas/parcel-event/versions/v1"
)

type Schema struct {
	Version int
	Schema  *goavro.Codec
}

type AvailableSchemas map[string]map[string]Schema

var SCHEMAS = AvailableSchemas{
	"parcelEvent": {
		"v1": v1.CreateSchema(),
	},
}
