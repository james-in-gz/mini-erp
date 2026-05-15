package repository

import (
	"backend/internal/database"
	"backend/internal/dto"
	"backend/internal/model"
	"time"

	"gorm.io/gorm"
)

func CreateOrder(order *model.Order) error {
	return database.DB.Create(order).Error
}

func GetOrders(
	q dto.OrderQuery,
) ([]model.Order, int64, error) {

	var orders []model.Order
	var total int64

	db := database.DB.Model(&model.Order{})

	// =========================
	// 搜索
	// =========================
	if q.Search != "" {

		search := "%" + q.Search + "%"

		db = db.Joins("LEFT JOIN customers ON customers.id = orders.customer_id").
			Where(`
				orders.order_no LIKE ?
				OR customers.name LIKE ?
			`,
				search,
				search,
			)
	}

	// =========================
	// 状态筛选
	// =========================
	if q.Status != "" {
		db = db.Where("orders.status = ?", q.Status)
	}

	// =========================
	// 总数
	// =========================
	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// =========================
	// 查询数据
	// =========================
	err := db.
		Preload("Customer", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "name")
		}).
		Preload("Items", func(db *gorm.DB) *gorm.DB {
			return db.Select(
				"id",
				"order_id",
				"sku_id",
				"sku_name",
				"quantity",
			)
		}).
		Preload("Shipments").
		Order("orders.id DESC").
		Limit(q.PageSize).
		Offset((q.Page - 1) * q.PageSize).
		Find(&orders).Error

	return orders, total, err
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
