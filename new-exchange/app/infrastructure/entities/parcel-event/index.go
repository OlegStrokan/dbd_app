package entities

import "gorm.io/gorm"

type ParcelEvent struct {
	gorm.Model
	Id           string `json:"id"`
	ParcelNumber string `json:"parcelNumber"`
	CreatedAt    string `json:"createdAt"`
	UpdatedAt    string `json:"updatedAt"`
	Weight       string `json:"weight"`
}
