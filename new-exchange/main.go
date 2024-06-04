package main

import (
	"log"
	. "new-exchange/app/workers"
)

func main() {
	log.Println("Starting app...")
	RegisterWorkers()

	select {}
}
