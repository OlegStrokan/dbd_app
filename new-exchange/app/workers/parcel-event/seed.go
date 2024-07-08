package parcel_event

import (
	"fmt"
	"log"
	"new-exchange/app/infrastructure/db"
	. "new-exchange/app/infrastructure/entities/parcel-event"

	"gorm.io/gorm"
)


func SaveDataToDatabase() *gorm.DB {
	log.Printf("Starting Parcel Event Worker\n")

	// Define the database connection configuration
	testDbConfig := db.DbConfig{
		Host:     "localhost",
		Port:     8434,
		User:     "stroka01",
		Password: "user",
		DbName:   "exchange_db",
	}
	db := db.ConnectToDb(testDbConfig)
	db.AutoMigrate(&ParcelEvent{})

	numItems := 3000000
	numWorkers := 10 
	counter := 0;

	ch := make(chan int, numWorkers)

	for i := 0; i < numItems; i++ {
		ch <- i 
		go func() {
			defer func() { <-ch }() 
			createParcelEvent(db)
			fmt.Printf("Counter %d\n", counter)
			counter++;
		}()
	}

	for j := 0; j < numWorkers; j++ {
		ch <- 0
	}

	return db
}
