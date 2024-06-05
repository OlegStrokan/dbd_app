package v1

import (
	"github.com/linkedin/goavro/v2"
	. "new-schema-registry/app/schemas"
)

type ParcelEventV1 struct {
	ID           string  `json:"id"`
	ParcelNumber string  `json:"parcelNumber"`
	CreatedAt    ISO8601 `json:"createdAt"`
	UpdatedAt    ISO8601 `json:"updatedAt"`
	Weight       float64 `json:"weight"`
}

func CreateSchema() (Schema, error) {
	schemaString := `{
		"type": "record",
		"name": "ParcelEventV1",
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
		Version: 1,
		Schema:  codec,
	}, nil
}
