package infrastructure

import (
	"github.com/bxcodec/faker/v3"
	. "new-exchange/app/infrastructure/entities/parcel-event"
	"time"
)

func getRandomParcelEvent() ParcelEvent {
	return ParcelEvent{
		Id:           faker.UUIDHyphenated(),
		ParcelNumber: faker.UUIDHyphenated(),
		CreatedAt:    time.Now().Format(time.RFC3339),
		UpdatedAt:    time.Now().Format(time.RFC3339),
		Weight:       faker.Word(),
	}
}
