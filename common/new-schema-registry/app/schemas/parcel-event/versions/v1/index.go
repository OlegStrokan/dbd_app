package v1

import (
	"github.com/wirelessr/avroschema"
	. "new-schema-registry/app/schemas"
)

type ParcelEventV1 struct {
	ID           string  `json:"id"`
	ParcelNumber string  `json:"parcelNumber"`
	CreatedAt    ISO8601 `json:"createdAt"`
	UpdatedAt    ISO8601 `json:"updatedAt"`
	Weight       float64 `json:"weight"`
}

func CreateSchema() Schema {
	avroschema.Reflect(&ParcelEventV1{})
}
