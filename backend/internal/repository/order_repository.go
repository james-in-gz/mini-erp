package repository

import (
	"backend/internal/database"
	"backend/internal/model"
)

func CreateOrder(order *model.Orders) error {
	return database.DB.Create(order).Error
}

func GetOrders() ([]model.Orders, error) {
	var orders []model.Orders
	err := database.DB.Preload("Customer").Preload("Items.SKU").Preload("Shipments").Find(&orders).Error
	return orders, err
}

func AddShipping(shipment *model.Shipment) error {
	return database.DB.Create(shipment).Error
}

func GetOrderByID(id uint) (model.Orders, error) {
	var order model.Orders
	err := database.DB.
		Preload("Customer").
		Preload("Items.SKU").
		Preload("PaymentRecords").
		Preload("Shipments.ShipmentItems").
		First(&order, id).Error
	return order, err
}

func UpdateOrderAddress(orderID uint, newAddr model.CustomerAddress) error {
	return database.DB.Model(&model.Orders{}).Where("id = ?", orderID).Updates(map[string]interface{}{
		"default_name":     newAddr.Name,
		"default_phone":    newAddr.Phone,
		"default_province": newAddr.Province,
		"default_city":     newAddr.City,
		"default_district": newAddr.District,
		"default_address":  newAddr.Address,
	}).Error
}
