package repository

import (
	"backend/internal/database"
	"backend/internal/model"
)

func CreateShipment(s *model.Shipment) error {
	return database.DB.Create(s).Error
}

func ListShipments(orderID uint) ([]model.Shipment, error) {
	var list []model.Shipment
	err := database.DB.
		Preload("ShipmentItems").
		Where("order_id = ?", orderID).
		Find(&list).Error
	return list, err
}
