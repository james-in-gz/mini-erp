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
	ID uint `gorm:"primaryKey" json:"id,omitempty"`

	OrderID uint `gorm:"index" json:"orderId,omitempty"`

	Amount float64 `gorm:"type:decimal(10,2)" json:"amount,omitempty"`

	Method string `gorm:"size:50" json:"method,omitempty"`
	// cash
	// bank
	// transfer
	// stripe
	// paypal

	Remark string `json:"remark,omitempty"`

	UserID uint `json:"userId,omitempty"`

	CreatedAt time.Time `json:"createdAt,omitempty"`
}
