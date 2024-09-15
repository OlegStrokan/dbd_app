package tests

import (
	"gorm.io/gorm"
	. "new-exchange/app/infrastructure/entities/parcel-event"
)

func ClearDB(db *gorm.DB) {
	if db.Migrator().HasTable(&ParcelEvent{}) {
		db.Migrator().DropTable(&ParcelEvent{})
	}
	db.AutoMigrate(&ParcelEvent{})
}
