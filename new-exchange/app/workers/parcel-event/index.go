package parcel_event

import (
	"github.com/robfig/cron/v3"
	"gorm.io/gorm"
	"log"
	"new-exchange/app/infrastructure/db"
	. "new-exchange/app/infrastructure/entities/parcel-event"
	. "new-exchange/app/infrastructure/entities/parcel-event/mocks/get-random-parcel-event"
)

var createParcelEvent = func(db *gorm.DB) {
	parcelEvent := GetRandomParcelEvent()
	result := db.Create(&parcelEvent)
	log.Println("Created parcel event", parcelEvent.Id)
	if result.Error != nil {
		panic("failed to create parcel event")
	}
}

func ParcelEventWorker() *gorm.DB {
	log.Printf("Starting Parcel Event Worker\n")
	testDbConfig := db.DbConfig{
		Host:     "localhost",
		Port:     8434,
		User:     "stroka01",
		Password: "user",
		DbName:   "exchange_db",
	}
	db := db.ConnectToDb(testDbConfig)
	db.AutoMigrate(&ParcelEvent{})
	c := cron.New(cron.WithSeconds())
	_, err := c.AddFunc("* * * * * *", func() {
		createParcelEvent(db)
	})

	if err != nil {
		log.Println("Error scheduling worker", err)
	}

	c.Start()
	return db
}
