package v2

import (
	"github.com/linkedin/goavro/v2"
	. "new-schema-registry/app/schemas/utils"
)

func CreateSchema() (Schema, error) {
	schemaString := `{
		"type": "record",
		"name": "ParcelEventV2",
		"fields": [
			{"name": "ID", "type": "string"},
			{"name": "ParcelNumber", "type": "string"},
			{"name": "CreatedAt", "type": "string"},
			{"name": "UpdatedAt", "type": "string"},
			{"name": "Weight", "type": "double"}
		]
	}`

	codec, err := goavro.NewCodec(schemaString)
	if err != nil {
		return Schema{}, err
	}

	return Schema{
		Version: 2,
		Schema:  codec,
	}, nil
}
