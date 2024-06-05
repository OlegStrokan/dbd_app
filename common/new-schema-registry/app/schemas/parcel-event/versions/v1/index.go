package v1

import (
	"github.com/linkedin/goavro/v2"
	. "new-schema-registry/app/schemas/utils"
)

func CreateSchema() (Schema, error) {
	schemaString := `{
		"type": "record",
		"name": "ParcelEventV1",
		"fields": [
			{"name": "ID", "type": "string"},
			{"name": "ParcelNumber", "type": "string"},
			{"name": "CreatedAt", "type": "string"},
			{"name": "UpdatedAt", "type": "string"}
		]
	}`

	codec, err := goavro.NewCodec(schemaString)
	if err != nil {
		return Schema{}, err
	}

	return Schema{
		Version: 1,
		Schema:  codec,
	}, nil
}
