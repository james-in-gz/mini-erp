package service

import (
	"backend/internal/database"
	"backend/internal/dto"
	"backend/internal/model"
	"backend/internal/repository"
	"errors"

	"gorm.io/gorm"
)

func CreateShipment(orderID uint, req dto.CreateShipmentReq) error {
	var order model.Orders

	order, err := repository.GetOrderByID(orderID)
	if err != nil {
		return err
	}

	return database.DB.Transaction(func(tx *gorm.DB) error {

		// 1️⃣ 创建发货单（地址从订单复制，未覆盖时使用默认地址）
		shipment := model.Shipment{
			OrderID: order.ID,

			ReceiverName:     req.ReceiverName,
			ReceiverPhone:    req.ReceiverPhone,
			ReceiverProvince: req.ReceiverProvince,
			ReceiverCity:     req.ReceiverCity,
			ReceiverDistrict: req.ReceiverDistrict,
			ReceiverAddress:  req.ReceiverAddress,

			Carrier:        req.Carrier,
			TrackingNumber: req.TrackingNumber,
			Status:         "shipped",
		}

		if shipment.ReceiverName == "" {
			shipment.ReceiverName = order.DefaultName
		}
		if shipment.ReceiverPhone == "" {
			shipment.ReceiverPhone = order.DefaultPhone
		}
		if shipment.ReceiverProvince == "" {
			shipment.ReceiverProvince = order.DefaultProvince
		}
		if shipment.ReceiverCity == "" {
			shipment.ReceiverCity = order.DefaultCity
		}
		if shipment.ReceiverDistrict == "" {
			shipment.ReceiverDistrict = order.DefaultDistrict
		}
		if shipment.ReceiverAddress == "" {
			shipment.ReceiverAddress = order.DefaultAddress
		}

		if err := tx.Create(&shipment).Error; err != nil {
			return err
		}

		// 2️⃣ 处理每个商品
		for _, item := range req.Items {

			var orderItem model.OrderItem
			if err := tx.Where("id = ? AND order_id = ?", item.OrderItemID, orderID).First(&orderItem).Error; err != nil {
			}

			// ❗校验数量
			if item.Quantity <= 0 {
				return errors.New("invalid_quantity")
			}

			if orderItem.ShippedQuantity+item.Quantity > orderItem.Quantity {
				return errors.New("exceed_available_quantity")
			}

			// 3️⃣ 创建发货商品
			shipmentItem := model.ShipmentItem{
				ShipmentID:  shipment.ID,
				OrderItemID: orderItem.ID,
				SKU:         orderItem.SKUCode,
				Quantity:    item.Quantity,
			}

			if err := tx.Create(&shipmentItem).Error; err != nil {
				return err
			}

			// 4️⃣ 更新已发数量
			orderItem.ShippedQuantity += item.Quantity
			if err := tx.Save(&orderItem).Error; err != nil {
				return err
			}
		}

		// 5️⃣ 更新订单状态 ⭐关键
		if err := updateOrderStatusWithTX(tx, order.ID); err != nil {
			return err
		}

		return nil
	})
}

func ListShipments(orderID uint) ([]model.Shipment, error) {
	return repository.ListShipments(orderID)
}
