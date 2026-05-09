package model

import "time"

type Orders struct {
	ID            uint       `gorm:"primaryKey" json:"id,omitempty"`
	OrderNo       string     `gorm:"size:100;uniqueIndex" json:"orderNo,omitempty"`
	CustomerID    uint       `gorm:"index" json:"customerID,omitempty"`
	Customer      Customer   `gorm:"foreignKey:CustomerID;references:ID" json:"customer,omitempty"`
	UserID        uint       `json:"userID,omitempty"` // 关联 User
	TotalAmount   float64    `json:"totalAmount,omitempty"`
	Status        string     `gorm:"size:30" json:"status,omitempty"` // pending / partial_shipped / shipped / done
	PaymentStatus string     `gorm:"size:30" json:"payment_status,omitempty"`
	PaymentMethod string     `gorm:"size:30" json:"payment_method,omitempty"` // wechat / alipay / cash / pos
	PaidAmount    float64    `gorm:"type:decimal(10,2)" json:"paid_amount,omitempty"`
	PaidAt        *time.Time `json:"paidAt,omitempty"`

	OrderType      string     `json:"orderType,omitempty"` // single / subscription
	Period         string     `json:"period,omitempty"`    // monthly / quarterly / yearly
	NextDeliveryAt *time.Time `json:"nextDeliveryAt,omitempty"`
	CreatedAt      time.Time  `json:"createdAt,omitempty"`
	UpdatedAt      time.Time  `json:"updatedAt,omitempty"`

	// 退款相关
	RefundAmount float64    `gorm:"type:decimal(10,2);default:0" json:"refundAmount,omitempty"`
	RefundedAt   *time.Time `json:"refundedAt,omitempty"`

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

	Items          []OrderItem     `gorm:"foreignKey:OrderID" json:"items,omitempty"`
	PaymentRecords []PaymentRecord `gorm:"foreignKey:OrderID" json:"paymentRecords,omitempty"`
	Shipments      []Shipment      `gorm:"foreignKey:OrderID" json:"shipments,omitempty"`
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
