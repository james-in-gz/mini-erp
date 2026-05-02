package database

import "backend/internal/model"

func AutoMigrate() {
	DB.AutoMigrate(
		&model.User{},

		&model.Customer{},
		&model.Tag{},
		&model.CustomerTag{},
		&model.CustomerNote{},

		&model.Product{},

		&model.Order{},
		&model.OrderItem{},

		&model.Shipment{},
		&model.ShipmentItem{},

		&model.Subscription{},
		&model.DeliveryTask{},

		&model.Payment{},
		&model.AuditLog{},
	)
}
