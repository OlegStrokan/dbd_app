package main

import (
	"log"
	// db "new-exchange/app/workers/parcel-event"
	workers "new-exchange/app/workers"
)

func main() {
	log.Println("Starting app...")
	workers.RegisterWorkers()
	select {}
}

func seed() {
	log.Println("Starting app...")
	
	// db.SaveDataToDatabase()


}

