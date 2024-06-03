package main

import "new-exchange/app/infrastructure/db"

func main() {

	gormDb := db.ConnectToDb()

	defer func() {
		sqlDB, err := gormDb.DB()
		if err != nil {
			panic("failed to get database instance")
		}
		sqlDB.Close()
	}()
}
