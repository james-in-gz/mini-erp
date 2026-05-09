package model

import "time"

type Payment struct {
	ID      uint `gorm:"primaryKey"`
	OrderID uint `gorm:"index"`

	Amount float64
	Method string `gorm:"size:50"`

	Status string `gorm:"size:50"`

	PaidAt *time.Time
}
type PaymentRecord struct {
	ID uint `gorm:"primaryKey"`

	OrderID uint `gorm:"index"`

	Amount float64 `gorm:"type:decimal(10,2)"`

	Method string `gorm:"size:50"`
	// cash
	// bank
	// transfer
	// stripe
	// paypal

	Remark string

	UserID uint

	CreatedAt time.Time
}
