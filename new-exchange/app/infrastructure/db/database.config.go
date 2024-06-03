package db

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectToDb() *gorm.DB {
	dsn := "user=stroka01 password=user dbname=exchange_db host=localhost port=9000"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}
	return db

}
