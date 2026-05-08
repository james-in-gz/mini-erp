package service

import (
	"backend/internal/enums"
	"backend/internal/model"
	"time"

	"gorm.io/gorm"
)

type CustomerLevelService struct {
	DB *gorm.DB
}

func (s *CustomerLevelService) RefreshCustomerLevel(customerID uint) error {

	var customer model.Customer

	if err := s.DB.First(&customer, customerID).Error; err != nil {
		return err
	}

	// 查询最近12个月订单
	var orders []model.Order

	twelveMonthsAgo := time.Now().AddDate(-1, 0, 0)

	err := s.DB.
		Where("customer_id = ?", customerID).
		Where("status = ?", "COMPLETED").
		Where("created_at >= ?", twelveMonthsAgo).
		Order("created_at asc").
		Find(&orders).Error

	if err != nil {
		return err
	}

	// 没订单,没买过，潜在客户
	if len(orders) == 0 && (customer.Level == "" || customer.Level == string(enums.Potential)) {

		customer.Level = string(enums.Potential)

		return s.DB.Save(&customer).Error
	}

	if len(orders) == 0 {
		// 没订单,但之前买过，流失客户,
		customer.Level = string(enums.New)

		return s.DB.Save(&customer).Error
	}

	// 统计
	var totalAmount float64

	for _, order := range orders {
		totalAmount += order.TotalAmount
	}

	orderCount := len(orders)

	repurchaseCount := 0

	if orderCount > 1 {
		repurchaseCount = orderCount - 1
	}

	// 平均复购周期
	avgDays := 999

	if orderCount > 1 {

		first := orders[0].CreatedAt
		last := orders[len(orders)-1].CreatedAt

		totalDays := int(last.Sub(first).Hours() / 24)

		avgDays = totalDays / repurchaseCount
	}

	// 自动判定等级（从高到低）
	level := enums.New

	switch {

	// 黑金会员
	case totalAmount >= 80000 &&
		orderCount >= 15 &&
		avgDays <= 30:

		level = enums.SuperVIP

	// 尊享会员
	case totalAmount >= 20000 &&
		orderCount >= 8 &&
		avgDays <= 45:

		level = enums.VIP

	// 臻养会员
	case totalAmount >= 5000 &&
		orderCount >= 5 &&
		avgDays <= 60:

		level = enums.Regular

	// 轻养会员
	case totalAmount >= 800 &&
		orderCount >= 2:

		level = enums.Casual

	default:
		level = enums.New
	}
	currentTime := time.Now()
	// 更新客户
	customer.Level = string(level)
	customer.TotalAmount12m = totalAmount
	customer.OrderCount12m = orderCount
	customer.RepurchaseCount12m = repurchaseCount
	customer.AvgRepurchaseDays = avgDays
	customer.LevelUpdatedAt = &currentTime

	return s.DB.Save(&customer).Error
}
