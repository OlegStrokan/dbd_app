package infrastructure

import (
	"github.com/bxcodec/faker/v3"
	"math/rand"
	. "new-exchange/app/infrastructure/entities/parcel-event"
	"strconv"
	"time"
)

func GetRandomParcelEvent() ParcelEvent {
	weight := rand.Float64() * 1000
	weightStr := strconv.FormatFloat(weight, 'f', 2, 64)
	return ParcelEvent{
		Id:           faker.UUIDHyphenated(),
		ParcelNumber: faker.UUIDHyphenated(),
		CreatedAt:    time.Now().UTC().Format(time.RFC3339),
		UpdatedAt:    time.Now().UTC().Format(time.RFC3339),
		Weight:       weightStr,
	}
}
