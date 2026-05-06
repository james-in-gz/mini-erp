package service

import (
	"backend/internal/model"
	"backend/internal/repository"
	"errors"
	"time"
)

func CreateShipment(orderID uint, req interface{}) error {

	r := req.(map[string]interface{})

	order, err := repository.GetOrderByID(orderID)
	if err != nil {
		return err
	}

	now := time.Now()

	shipment := model.Shipment{
		OrderID:          orderID,
		TrackingNumber:   r["TrackingNumber"].(string),
		Carrier:          r["Carrier"].(string),
		ReceiverName:     r["ReceiverName"].(string),
		ReceiverPhone:    r["ReceiverPhone"].(string),
		ReceiverProvince: r["ReceiverProvince"].(string),
		ReceiverCity:     r["ReceiverCity"].(string),
		ReceiverDistrict: r["ReceiverDistrict"].(string),
		ReceiverAddress:  r["ReceiverAddress"].(string),
		ShippedAt:        &now,
		Status:           "shipped",
	}

	// ⭐ 构建 ShipmentItems
	items := r["Items"].([]interface{})
	for _, itemInterface := range items {
		item := itemInterface.(map[string]interface{})

		orderItemID := uint(item["OrderItemID"].(float64))
		quantity := int(item["Quantity"].(float64))

		orderItem := findOrderItem(order.Items, orderItemID)
		if orderItem == nil {
			return errors.New("order item not found")
		}

		if quantity <= 0 {
			return errors.New("invalid quantity")
		}

		if orderItem.ShippedQuantity+quantity > orderItem.Quantity {
			return errors.New("exceed quantity")
		}

		shipment.ShipmentItems = append(shipment.ShipmentItems, model.ShipmentItem{
			OrderItemID: orderItemID,
			ProductID:   orderItem.ProductID,
			ProductName: orderItem.ProductName,
			SKU:         orderItem.ProductSKU,
			Quantity:    quantity,
		})

		// 更新已发数量
		orderItem.ShippedQuantity += quantity
	}

	// 更新订单状态
	updateOrderStatus(order)

	return repository.CreateShipment(&shipment)
}

func ListShipments(orderID uint) ([]model.Shipment, error) {
	return repository.ListShipments(orderID)
}
