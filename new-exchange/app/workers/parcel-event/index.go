package parcel_event

import (
	"fmt"
	"github.com/robfig/cron/v3"
	"new-exchange/app/infrastructure/db"
	. "new-exchange/app/infrastructure/entities/parcel-event"
	. "new-exchange/app/infrastructure/entities/parcel-event/mocks/get-random-parcel-event"
)

func ParcelEventWorker() {
	fmt.Printf("Starting Parcel Event Worker\n")
	c := cron.New()
	c.AddFunc("* * * * * *", func() {
		db := db.ConnectToDb()
		db.AutoMigrate(&ParcelEvent{})
		parcelEvent := GetRandomParcelEvent()
		result := db.Create(&parcelEvent)
		if result.Error != nil {
			panic("failed to create parcel event")
		}
	})
	c.Start()
}
