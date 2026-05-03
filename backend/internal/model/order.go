package model

import "time"

type Order struct {
	ID      uint   `gorm:"primaryKey" json:"id,omitempty"`
	OrderNo string `gorm:"uniqueIndex;size:100" json:"orderNo,omitempty"`

	CustomerID uint `gorm:"index" json:"customerID,omitempty"`
	UserID     uint `json:"userID,omitempty"`

	Status        string `gorm:"size:50;index" json:"status,omitempty"`
	PaymentStatus string `gorm:"size:50" json:"paymentStatus,omitempty"`

	TotalAmount    float64 `json:"totalAmount,omitempty"`
	DiscountAmount float64 `json:"discountAmount,omitempty"`
	FinalAmount    float64 `json:"finalAmount,omitempty"`

	CreatedAt time.Time `json:"createdAt,omitempty"`
	UpdatedAt time.Time `json:"updatedAt,omitempty"`

	OrderItems []OrderItem `json:"orderItems,omitempty"`
}

func (Order) TableName() string {
	return "orders"
}

type OrderItem struct {
	ID      uint `gorm:"primaryKey" json:"id,omitempty"`
	OrderID uint `gorm:"index" json:"orderID,omitempty"`

	ProductID   uint    `json:"productID,omitempty"`
	ProductName string  `gorm:"size:255" json:"productName,omitempty"`
	Price       float64 `json:"price,omitempty"`
	Quantity    int     `json:"quantity,omitempty"`
	TotalPrice  float64 `json:"totalPrice,omitempty"`
}
