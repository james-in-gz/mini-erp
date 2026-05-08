package model

import "time"

type Orders struct {
	ID             uint       `gorm:"primaryKey" json:"id,omitempty"`
	OrderNo        string     `gorm:"size:100;uniqueIndex" json:"orderNo,omitempty"`
	CustomerID     uint       `gorm:"index" json:"customerID,omitempty"`
	Customer       Customer   `gorm:"foreignKey:CustomerID;references:ID" json:"customer,omitempty"`
	UserID         uint       `json:"userID,omitempty"` // 关联 User
	TotalAmount    float64    `json:"totalAmount,omitempty"`
	Status         string     `json:"status,omitempty"`    // pending / partial_shipped / shipped / done
	OrderType      string     `json:"orderType,omitempty"` // single / subscription
	Period         string     `json:"period,omitempty"`    // monthly / quarterly / yearly
	NextDeliveryAt *time.Time `json:"nextDeliveryAt,omitempty"`
	CreatedAt      time.Time  `json:"createdAt,omitempty"`
	UpdatedAt      time.Time  `json:"updatedAt,omitempty"`

	// 下单地址（不可变）
	OriginName     string `json:"originName,omitempty"`
	OriginPhone    string `json:"originPhone,omitempty"`
	OriginProvince string `json:"originProvince,omitempty"`
	OriginCity     string `json:"originCity,omitempty"`
	OriginDistrict string `json:"originDistrict,omitempty"`
	OriginAddress  string `json:"originAddress,omitempty"`

	// 当前默认地址（可改）
	DefaultName     string `json:"defaultName,omitempty"`
	DefaultPhone    string `json:"defaultPhone,omitempty"`
	DefaultProvince string `json:"defaultProvince,omitempty"`
	DefaultCity     string `json:"defaultCity,omitempty"`
	DefaultDistrict string `json:"defaultDistrict,omitempty"`
	DefaultAddress  string `json:"defaultAddress,omitempty"`

	Items     []OrderItem `gorm:"foreignKey:OrderID" json:"items,omitempty"`
	Shipments []Shipment  `gorm:"foreignKey:OrderID" json:"shipments,omitempty"`
}

type OrderItem struct {
	ID      uint `gorm:"primaryKey" json:"id,omitempty"`
	OrderID uint `gorm:"index" json:"orderID,omitempty"`

	SKUID uint `gorm:"index" json:"skuid,omitempty"`
	SKU   SKU  `gorm:"foreignKey:SKUID;references:ID" json:"sku,omitempty"`

	SKUCode string `json:"skuCode,omitempty"`
	SKUName string `json:"skuName,omitempty"`

	Quantity int     `json:"quantity,omitempty"`
	Price    float64 `json:"price,omitempty"`
	Subtotal float64 `json:"subtotal,omitempty"`

	ShippedQuantity int `json:"shippedQuantity,omitempty"`

	CreatedAt time.Time
}
