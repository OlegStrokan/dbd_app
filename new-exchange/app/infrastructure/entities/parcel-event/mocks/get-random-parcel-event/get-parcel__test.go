package infrastructure

import (
	entities "new-exchange/app/infrastructure/entities/parcel-event"
	"testing"
)

func TestGetRandomParcelEvent(t *testing.T) {
	parcelEvent := GetRandomParcelEvent()
	isParcelEventValid(&parcelEvent)

}

func isParcelEventValid(parcel *entities.ParcelEvent) {

}
