package workers

import . "new-exchange/app/workers/parcel-event"

func RegisterWorkers() {
	ParcelEventWorker()
}
