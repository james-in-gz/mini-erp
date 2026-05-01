package model

import "time"

type Subscription struct {
	ID                  uint      `gorm:"primaryKey"`
	CustomerID          uint      `gorm:"index"`
	OrderID             uint

	TotalCycles         int
	RemainingCycles     int

	DeliveryIntervalDays int

	NextDeliveryDate    *time.Time

	Status              string    `gorm:"size:50;index"`

	CreatedAt           time.Time
	UpdatedAt           time.Time
}
