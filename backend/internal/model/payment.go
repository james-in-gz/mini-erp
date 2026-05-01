package model

import "time"

type Payment struct {
	ID        uint      `gorm:"primaryKey"`
	OrderID   uint      `gorm:"index"`

	Amount    float64
	Method    string    `gorm:"size:50"`

	Status    string    `gorm:"size:50"`

	PaidAt    *time.Time
}
