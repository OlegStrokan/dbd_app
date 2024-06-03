package workers

import (
	"github.com/robfig/cron/v3"
	"log"
)

type WorkerFunction func() error

type WorkerOption struct {
	Function WorkerFunction
	Schedule string
}

type Worker struct {
	CronJob *cron.Cron
	EntryID cron.EntryID
}

func CreateWorker(options WorkerOption) *Worker {
	c := cron.New(cron.WithSeconds())
	entryId, err := c.AddFunc(options.Schedule, func() {
		err := options.Function()
		if err != nil {
			log.Println("Error executing worker function", err)
		}

	})
	if err != nil {

		log.Println("Error scheduling worker", err)
		return nil
	}

	c.Start()

	return &Worker{
		CronJob: c,
		EntryID: entryId,
	}
}
