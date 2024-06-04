package main

import (
	. "new-exchange/app/workers/parcel-event"
)

func main() {
	ParcelEventWorker()

	select {}
}
