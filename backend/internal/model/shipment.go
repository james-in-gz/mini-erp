package model

import "time"

type Shipment struct {
	ID              uint      `gorm:"primaryKey"`
	OrderID         uint      `gorm:"index"`

	ShipmentNo      string    `gorm:"size:100;index"`

	Status          string    `gorm:"size:50;index"`

	DeliveryType    string    `gorm:"size:50"` // express / local

	TrackingNumber  string    `gorm:"size:100"`
	Carrier         string    `gorm:"size:100"`

	ShippedAt       *time.Time
	DeliveredAt     *time.Time

	ShipmentItems   []ShipmentItem
}

type ShipmentItem struct {
	ID           uint `gorm:"primaryKey"`
	ShipmentID   uint `gorm:"index"`
	OrderItemID  uint

	Quantity     int
}
