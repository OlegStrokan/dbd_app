package parcel_event

import (
	"new-exchange/app/infrastructure/db"
	. "new-exchange/app/infrastructure/entities/parcel-event"
	. "new-exchange/app/utlis/tests"
	"testing"
)

func TestCreateParcelEvent(t *testing.T) {

	testDbConfig := db.DbConfig{
		Host:     "localhost",
		Port:     5434,
		User:     "stroka01",
		Password: "test",
		DbName:   "exchange_test_db",
	}
	db := db.ConnectToDb(testDbConfig)

	ClearDB(db)

	createParcelEvent(db)
	var parcelEvent ParcelEvent
	result := db.Last(&parcelEvent)
	if result.Error != nil {
		t.Errorf("Failed to create ParcelEvent: %v", result.Error)
	}

	var newParcelEvent ParcelEvent
	result = db.Where("id = ?", parcelEvent.Id).First(&newParcelEvent)
	if result.Error != nil {
		t.Errorf("Failed to find the new ParcelEvent in the database: %v", result.Error)
	}
}
