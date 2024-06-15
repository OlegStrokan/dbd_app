package entities

type ParcelEvent struct {
    ID           string `gorm:"column:id"`
    ParcelNumber string `gorm:"column:parcelNumber"`
    CreatedAt    string `gorm:"column:createdAt"`
    UpdatedAt    string `gorm:"column:updatedAt"`
    Weight       string `gorm:"column:weight"`
}
