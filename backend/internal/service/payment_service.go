package service

import (
	"backend/internal/database"
	"backend/internal/model"
	"time"

	"gorm.io/gorm"
)

func CreatePayment(
	orderID string,
	amount float64,
	method string,
	remark string,
) error {

	return database.DB.Transaction(func(tx *gorm.DB) error {

		// 1. 查订单
		var order model.Orders

		if err := tx.First(&order, orderID).Error; err != nil {
			return err
		}

		// 2. 创建收款记录
		record := model.PaymentRecord{
			OrderID: order.ID,
			Amount:  amount,
			Method:  method,
			Remark:  remark,
		}

		if err := tx.Create(&record).Error; err != nil {
			return err
		}

		// 3. 重新计算已付款金额
		var totalPaid float64

		tx.Model(&model.PaymentRecord{}).
			Where("order_id = ?", order.ID).
			Select("COALESCE(SUM(amount),0)").
			Scan(&totalPaid)

		order.PaidAmount = totalPaid

		// 4. 自动计算付款状态
		if totalPaid <= 0 {

			order.PaymentStatus = "unpaid"

		} else if totalPaid < order.TotalAmount {

			order.PaymentStatus = "partial"

		} else {

			order.PaymentStatus = "paid"

			now := time.Now()

			order.PaidAt = &now
		}

		// 5. 保存订单
		if err := tx.Save(&order).Error; err != nil {
			return err
		}

		return nil
	})
}
