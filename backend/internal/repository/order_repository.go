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
	err := database.DB.Preload("Items").Preload("Shippings").Find(&orders).Error
	return orders, err
}

func AddShipping(shipping *model.Shipment) error {
	return database.DB.Create(shipping).Error
}

func GetOrderByID(id uint) (model.Order, error) {
	var order model.Order
	err := database.DB.
		Preload("Items.Product").
		First(&order, id).Error
	return order, err
}
