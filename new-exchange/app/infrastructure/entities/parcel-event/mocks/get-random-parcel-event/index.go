package infrastructure

import (
	"math/rand"
	. "new-exchange/app/infrastructure/entities/parcel-event"
	"strconv"
	"time"

	"github.com/bxcodec/faker/v3"
)

func GetRandomParcelEvent() ParcelEvent {
	weight := rand.Float64() * 1000
	weightStr := strconv.FormatFloat(weight, 'f', 2, 64)
	return ParcelEvent{
		ID:           faker.UUIDHyphenated(),
		ParcelNumber: faker.CCNumber(),
		CreatedAt:    time.Now().UTC().Format(time.RFC3339),
		UpdatedAt:    time.Now().UTC().Format(time.RFC3339),
		Weight:       weightStr,
	}
}
