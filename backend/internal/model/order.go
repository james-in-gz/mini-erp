package model

import "time"

type Order struct {
	ID             uint      `gorm:"primaryKey"`
	OrderNo        string    `gorm:"uniqueIndex;size:100"`

	CustomerID     uint      `gorm:"index"`
	UserID         uint

	Status         string    `gorm:"size:50;index"`
	PaymentStatus  string    `gorm:"size:50"`

	TotalAmount    float64
	DiscountAmount float64
	FinalAmount    float64

	CreatedAt      time.Time
	UpdatedAt      time.Time

	OrderItems     []OrderItem
}

func (Order) TableName() string {
	return "orders"
}

