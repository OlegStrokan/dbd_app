package infrastructure

import (
	"math/rand"
	. "new-exchange/app/infrastructure/entities/parcel-event"
	"time"

	"github.com/bxcodec/faker/v3"
)

func GetRandomParcelEventV1() ParcelEvent {
	return ParcelEvent{
		ID:           faker.UUIDHyphenated(),
		ParcelNumber: faker.CCNumber(),
		CreatedAt:    time.Now().UTC().Format(time.RFC3339),
		UpdatedAt:    time.Now().UTC().Format(time.RFC3339),
	}
}

func GetRandomParcelEventV2() ParcelEvent {
	 weight := rand.Float64() * 1000
	return ParcelEvent{
		ID:           faker.UUIDHyphenated(),
		ParcelNumber: faker.CCNumber(),
		CreatedAt:    time.Now().UTC().Format(time.RFC3339),
		UpdatedAt:    time.Now().UTC().Format(time.RFC3339),
		Weight:       weight,
	}
}

func GetRandomParcelEventV3() ParcelEvent {
	weight := rand.Float64() * 1000
	return ParcelEvent{
		ID:           faker.UUIDHyphenated(),
		ParcelNumber: faker.CCNumber(),
		CreatedAt:    time.Now().UTC().Format(time.RFC3339),
		UpdatedAt:    time.Now().UTC().Format(time.RFC3339),
		Weight:       weight,
	}
}
