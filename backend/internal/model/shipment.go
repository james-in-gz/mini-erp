package model

import "time"

type Shipment struct {
	ID uint `gorm:"primaryKey" json:"id,omitempty"`

	WarehouseID uint      `json:"warehouseID,omitempty"`
	Warehouse   Warehouse `gorm:"foreignKey:WarehouseID;references:ID" json:"warehouse,omitempty"`
	OrderID     uint      `json:"orderID,omitempty"`
	Order       Order     `gorm:"foreignKey:OrderID;references:ID" json:"order,omitempty"`

	ShipmentNo string `json:"shipmentNo,omitempty"`
	Status     string `json:"status,omitempty"`

	// 🚚 物流
	TrackingNumber string `json:"trackingNumber,omitempty"`
	Carrier        string `json:"carrier,omitempty"`

	// 📍 ⭐ 地址快照（关键）
	ReceiverName     string `json:"receiverName,omitempty"`
	ReceiverPhone    string `json:"receiverPhone,omitempty"`
	ReceiverProvince string `json:"receiverProvince,omitempty"`
	ReceiverCity     string `json:"receiverCity,omitempty"`
	ReceiverDistrict string `json:"receiverDistrict,omitempty"`
	ReceiverAddress  string `json:"receiverAddress,omitempty"`

	ShippedAt   *time.Time `gorm:"autoCreateTime" json:"shippedAt,omitempty"`
	DeliveredAt *time.Time `json:"deliveredAt,omitempty"`

	ShipmentItems []ShipmentItem `json:"shipmentItems,omitempty"`
}

type ShipmentItem struct {
	ID          uint   `gorm:"primaryKey" json:"id,omitempty"`
	ShipmentID  uint   `gorm:"index" json:"shipmentID,omitempty"`
	OrderItemID uint   `json:"orderItemID,omitempty"`
	SKU         string `json:"sku,omitempty"`
	Quantity    int    `json:"quantity,omitempty"`
}
