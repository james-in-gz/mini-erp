package service

import (
	"backend/internal/model"
	"backend/internal/repository"
	"errors"
	"time"
)

func CreateShipment(orderID uint, req interface{}) error {

	r := req.(struct {
		TrackingNumber   string
		Carrier          string
		ReceiverName     string
		ReceiverPhone    string
		ReceiverProvince string
		ReceiverCity     string
		ReceiverDistrict string
		ReceiverAddress  string
		Items            []struct {
			OrderItemID uint
			Quantity    int
		}
	})

	order, err := repository.GetOrderByID(orderID)
	if err != nil {
		return err
	}

	now := time.Now()

	shipment := model.Shipment{
		OrderID:          orderID,
		TrackingNumber:   r.TrackingNumber,
		Carrier:          r.Carrier,
		ReceiverName:     r.ReceiverName,
		ReceiverPhone:    r.ReceiverPhone,
		ReceiverProvince: r.ReceiverProvince,
		ReceiverCity:     r.ReceiverCity,
		ReceiverDistrict: r.ReceiverDistrict,
		ReceiverAddress:  r.ReceiverAddress,
		ShippedAt:        &now,
		Status:           "shipped",
	}

	// ⭐ 构建 ShipmentItems
	for _, item := range r.Items {

		orderItem := findOrderItem(order.Items, item.OrderItemID)
		if orderItem == nil {
			return errors.New("order item not found")
		}

		if item.Quantity <= 0 {
			return errors.New("invalid quantity")
		}

		if orderItem.ShippedQuantity+item.Quantity > orderItem.Quantity {
			return errors.New("exceed quantity")
		}

		shipment.ShipmentItems = append(shipment.ShipmentItems, model.ShipmentItem{
			OrderItemID: item.OrderItemID,
			ProductID:   orderItem.ProductID,
			ProductName: orderItem.ProductName,
			SKU:         orderItem.ProductSKU,
			Quantity:    item.Quantity,
		})

		// 更新已发数量
		orderItem.ShippedQuantity += item.Quantity
	}

	// 更新订单状态
	updateOrderStatus(order)

	return repository.CreateShipment(&shipment)
}

func ListShipments(orderID uint) ([]model.Shipment, error) {
	return repository.ListShipments(orderID)
}
