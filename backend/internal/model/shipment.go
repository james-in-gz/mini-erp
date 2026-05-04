package model

import "time"

type Shipment struct {
	ID      uint `gorm:"primaryKey"`
	OrderID uint

	ShipmentNo string
	Status     string

	// 🚚 物流
	TrackingNumber string
	Carrier        string

	// 📍 ⭐ 地址快照（关键）
	ReceiverName     string
	ReceiverPhone    string
	ReceiverProvince string
	ReceiverCity     string
	ReceiverDistrict string
	ReceiverAddress  string

	ShippedAt   *time.Time
	DeliveredAt *time.Time

	ShipmentItems []ShipmentItem
}

type ShipmentItem struct {
	ID          uint `gorm:"primaryKey"`
	ShipmentID  uint `gorm:"index"`
	OrderItemID uint

	ProductID   uint
	ProductName string

	SKU      string
	Quantity int
}
