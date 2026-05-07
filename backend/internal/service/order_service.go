package service

import (
	"backend/internal/database"
	"backend/internal/model"
	"backend/internal/number"
	"backend/internal/repository"
	"errors"
	"time"

	"gorm.io/gorm"
)

type CreateOrderReq struct {
	CustomerID uint `json:"customer_id"`
	AddressID  uint `json:"address_id"`
	Items      []struct {
		ProductID uint `json:"product_id"`
		Quantity  int  `json:"quantity"`
	} `json:"items"`
}

func CreateOrder(req CreateOrderReq) (*model.Order, error) {

	// ⭐ 获取客户的地址信息
	address, err := repository.GetAddressByID(req.AddressID)
	if err != nil {
		return nil, err
	}

	var total float64
	var items []model.OrderItem

	// ⭐ 简化：先写死价格（后面再接 product）
	for _, i := range req.Items {
		price := 100.0

		total += price * float64(i.Quantity)

		items = append(items, model.OrderItem{

			Quantity: i.Quantity,
			Price:    price,
		})
	}

	NumberGenerator := number.NewNumberGenerator(database.DB)
	orderNo, err := NumberGenerator.Generate("SO")
	if err != nil {
		return nil, err
	}

	order := model.Order{
		CustomerID:  req.CustomerID,
		OrderNo:     orderNo,
		TotalAmount: total,
		Status:      "pending",
		Items:       items,
		// 下单地址（不可变）
		OriginName:     address.Name,
		OriginPhone:    address.Phone,
		OriginProvince: address.Province,
		OriginCity:     address.City,
		OriginDistrict: address.District,
		OriginAddress:  address.Address,
		// 当前默认地址（可改）
		DefaultName:     address.Name,
		DefaultPhone:    address.Phone,
		DefaultProvince: address.Province,
		DefaultCity:     address.City,
		DefaultDistrict: address.District,
		DefaultAddress:  address.Address,
	}

	err = repository.CreateOrder(&order)
	if err != nil {
		return nil, err
	}

	return &order, nil
}

func AddShipping(orderID uint, tracking string) error {
	now := time.Now()
	shipping := model.Shipment{
		OrderID:        orderID,
		TrackingNumber: tracking,
		ShippedAt:      &now,
		Status:         "shipped",
	}

	return repository.AddShipping(&shipping)
}

func GetOrders() ([]model.Order, error) {
	return repository.GetOrders()
}

func updateOrderStatus(order model.Order) {
	panic("unimplemented")
}

func updateOrderStatusWithTX(tx *gorm.DB, orderID uint) error {
	var items []model.OrderItem
	if err := tx.Where("order_id = ?", orderID).Find(&items).Error; err != nil {
		return err
	}

	if len(items) == 0 {
		return errors.New("no order items")
	}

	allShipped := true
	anyShipped := false

	for _, item := range items {
		if item.ShippedQuantity > 0 {
			anyShipped = true
		}
		if item.ShippedQuantity < item.Quantity {
			allShipped = false
		}
	}

	var order model.Order
	if err := tx.First(&order, orderID).Error; err != nil {
		return err
	}

	switch {
	case allShipped:
		order.Status = "completed"
	case anyShipped:
		order.Status = "partial_shipped"
	default:
		order.Status = "pending"
	}

	return tx.Save(&order).Error
}

func findOrderItem(items []model.OrderItem, id uint) *model.OrderItem {
	for i, item := range items {
		if item.ID == id {
			return &items[i]
		}
	}
	return nil
}

func GetOrderByID(id uint) (model.Order, error) {
	return repository.GetOrderByID(id)
}
