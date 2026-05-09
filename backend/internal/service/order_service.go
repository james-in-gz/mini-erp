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
		SKUID    uint    `json:"skuId"`
		Quantity int     `json:"quantity"`
		Price    float64 `json:"price"`
	} `json:"items"`
}

func CreateOrder(req CreateOrderReq) (*model.Orders, error) {

	// ⭐ 获取客户的地址信息
	address, err := repository.GetAddressByID(req.AddressID)
	if err != nil {
		return nil, err
	}

	var total float64
	var items []model.OrderItem

	for _, i := range req.Items {
		sku, err := repository.GetSKUByID(int(i.SKUID))
		if err != nil {
			return nil, err
		}

		price := i.Price

		total += price * float64(i.Quantity)

		items = append(items, model.OrderItem{
			SKUID:    i.SKUID,
			SKUCode:  sku.Code,
			SKUName:  sku.Name,
			Quantity: i.Quantity,
			Price:    price,
			Subtotal: price * float64(i.Quantity),
		})
	}

	NumberGenerator := number.NewNumberGenerator(database.DB)
	orderNo, err := NumberGenerator.Generate("SO")
	if err != nil {
		return nil, err
	}

	order := model.Orders{
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

	err = database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&order).Error; err != nil {
			return err
		}

		for _, item := range order.Items {
			err := repository.DeductStock(item.SKUID, item.Quantity, order.ID, "订单锁定库存")
			if err != nil {
				return err
			}
		}

		return nil
	})

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

func GetOrders() ([]model.Orders, error) {
	return repository.GetOrders()
}

func updateOrderStatus(order model.Orders) {
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

	var order model.Orders
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

func GetOrderByID(id uint) (model.Orders, error) {
	return repository.GetOrderByID(id)
}

func ChangeOrderAddress(orderID uint, addressID uint) error {
	address, err := repository.GetAddressByID(addressID)
	if err != nil {
		return err
	}

	return repository.UpdateOrderAddress(orderID, address)
}

func CancelOrder(orderID uint) error {
	return database.DB.Transaction(func(tx *gorm.DB) error {
		var order model.Orders
		if err := tx.Preload("Items").First(&order, orderID).Error; err != nil {
			return err
		}

		for _, item := range order.Items {
			err := repository.ReleaseLock(item.SKUID, item.Quantity, orderID)
			if err != nil {
				return err
			}
		}

		order.Status = "cancelled"
		if err := tx.Save(&order).Error; err != nil {
			return err
		}

		return nil
	})
}
