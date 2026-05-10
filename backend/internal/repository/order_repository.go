package repository

import (
	"backend/internal/database"
	"backend/internal/model"
	"time"
)

func CreateOrder(order *model.Order) error {
	return database.DB.Create(order).Error
}

func GetOrders() ([]model.Order, error) {
	var orders []model.Order
	err := database.DB.Preload("Customer").Preload("Items.SKU").Preload("Shipments").Find(&orders).Error
	return orders, err
}

func AddShipping(shipment *model.Shipment) error {
	return database.DB.Create(shipment).Error
}

func GetOrderByID(id uint) (model.Order, error) {
	var order model.Order
	err := database.DB.
		Preload("Customer").
		Preload("Items.SKU").
		Preload("PaymentRecords").
		Preload("Shipments.ShipmentItems").
		First(&order, id).Error
	return order, err
}

func UpdateOrderAddress(orderID uint, newAddr model.CustomerAddress) error {
	return database.DB.Model(&model.Order{}).Where("id = ?", orderID).Updates(map[string]interface{}{
		"default_name":     newAddr.Name,
		"default_phone":    newAddr.Phone,
		"default_province": newAddr.Province,
		"default_city":     newAddr.City,
		"default_district": newAddr.District,
		"default_address":  newAddr.Address,
	}).Error
}

func UpdateOrderNextDeliveryTime(orderID uint, nextDeliveryAt *time.Time) error {
	if nextDeliveryAt == nil {
		return database.DB.Model(&model.Order{}).Where("id = ?", orderID).Update("next_delivery_at", nil).Error
	}
	return database.DB.Model(&model.Order{}).Where("id = ?", orderID).Update("next_delivery_at", *nextDeliveryAt).Error
}
