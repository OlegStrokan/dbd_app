package parcel_event

import (
	"gorm.io/gorm"
	. "new-exchange/app/infrastructure/entities/parcel-event"
	. "new-exchange/app/infrastructure/entities/parcel-event/mocks/get-random-parcel-event"
	"regexp"
	"strconv"
	"testing"
	"time"
)

func TestCron(t *testing.T) {
	counter := 0

	createParcelEvent = func(db *gorm.DB) {
		counter++
	}

	ParcelEventWorker()

	time.Sleep(5 * time.Second)

	if counter != 5 {
		t.Errorf("Expected 5 but got %d", counter)
	}
}

func TestGetRandomParcelEvent(t *testing.T) {
	parcelEvent := GetRandomParcelEvent()
	isParcelEventValid(t, &parcelEvent)
}

func isParcelEventValid(t *testing.T, parcel *ParcelEvent) {
	uuidRegex := regexp.MustCompile(`\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b`)

	if !uuidRegex.MatchString(parcel.Id) {
		t.Errorf("Invalid Id: not in UUID format")
	}

	if !uuidRegex.MatchString(parcel.ParcelNumber) {
		t.Errorf("Invalid ParcelNumber: not in UUID format")
	}

	timeFormat := time.RFC3339

	if _, err := time.Parse(timeFormat, parcel.CreatedAt); err != nil {
		t.Errorf("Invalid CreatedAt: %v", err)
	}

	if _, err := time.Parse(timeFormat, parcel.UpdatedAt); err != nil {
		t.Errorf("Invalid UpdatedAt: %v", err)
	}

	if _, err := strconv.ParseFloat(parcel.Weight, 64); err != nil {
		t.Errorf("Invalid Weight: %v", err)
	}
}
