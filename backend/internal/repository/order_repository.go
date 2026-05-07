package repository

import (
	"backend/internal/database"
	"backend/internal/model"
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
		Preload("Shipments.ShipmentItems").
		First(&order, id).Error
	return order, err
}
