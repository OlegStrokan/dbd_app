package utils

import "github.com/linkedin/goavro/v2"

type Schema struct {
	Version int
	Schema  *goavro.Codec
}

type AvailableSchemas map[string]map[string]Schema
