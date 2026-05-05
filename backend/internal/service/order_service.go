package service

import (
	"backend/internal/model"
	"backend/internal/repository"
	"time"
)

type CreateOrderReq struct {
	CustomerID uint `json:"customer_id"`
	AddressID  uint `json:"address_id"`
	Items      []struct {
		ProductID uint `json:"product_id"`
		Quantity  int  `json:"quantity"`
	} `json:"items"`
}

func CreateOrder(req CreateOrderReq) error {

	var total float64
	var items []model.OrderItem

	// ⭐ 简化：先写死价格（后面再接 product）
	for _, i := range req.Items {
		price := 100.0

		total += price * float64(i.Quantity)

		items = append(items, model.OrderItem{
			ProductID: i.ProductID,
			Quantity:  i.Quantity,
			Price:     price,
		})
	}

	order := model.Order{
		CustomerID:  req.CustomerID,
		AddressID:   req.AddressID,
		TotalAmount: total,
		Status:      "pending",
		Items:       items,
	}

	return repository.CreateOrder(&order)
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
