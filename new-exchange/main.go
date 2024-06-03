package main

import (
	. "new-exchange/app/workers/parcel-event"
	"sync"
)

func main() {
	ParcelEventWorker()
	// Wait forever
	var wg sync.WaitGroup
	wg.Add(1)
	wg.Wait()
}
