package model

import "time"

type Order struct {
	ID             uint       `gorm:"primaryKey" json:"id,omitempty"`
	CustomerID     uint       `gorm:"index" json:"customerID,omitempty"`
	AddressID      uint       `json:"addressID,omitempty"`
	UserID         uint       `json:"userID,omitempty"` // 关联 User
	TotalAmount    float64    `json:"totalAmount,omitempty"`
	Status         string     `json:"status,omitempty"`    // pending / shipped / done
	OrderType      string     `json:"orderType,omitempty"` // single / subscription
	Period         string     `json:"period,omitempty"`    // monthly / quarterly / yearly
	NextDeliveryAt *time.Time `json:"nextDeliveryAt,omitempty"`
	CreatedAt      time.Time  `json:"createdAt,omitempty"`
	UpdatedAt      time.Time  `json:"updatedAt,omitempty"`

	Items     []OrderItem `json:"items,omitempty"`
	Shippings []Shipment  `json:"shippings,omitempty"`
}

func (Order) TableName() string {
	return "orders"
}

type OrderItem struct {
	ID      uint `gorm:"primaryKey" json:"id,omitempty"`
	OrderID uint `gorm:"index" json:"orderID,omitempty"`

	ProductID       uint    `json:"productID,omitempty"`
	ProductName     string  `gorm:"size:255" json:"productName,omitempty"`
	ProductSKU      string  `gorm:"size:100" json:"productSKU,omitempty"`
	Price           float64 `json:"price,omitempty"`
	Quantity        int     `json:"quantity,omitempty"`
	ShippedQuantity int     `json:"shippedQuantity,omitempty"`
	TotalPrice      float64 `json:"totalPrice,omitempty"`
}
