package repository

import (
	"backend/internal/database"
	"backend/internal/model"
)

func CreateCustomer(customer *model.Customer) error {
	return database.DB.Create(customer).Error
}

func GetCustomerByPhone(phone string) (*model.Customer, error) {
	var customer model.Customer

	err := database.DB.Where("phone = ?", phone).First(&customer).Error
	if err != nil {
		return nil, err
	}

	return &customer, nil
}

func ListCustomers(page, pageSize int, ownerID uint, status, keyword string) ([]model.Customer, int64, error) {
	var customers []model.Customer
	var total int64

	db := database.DB.Model(&model.Customer{})

	// 🔥 私域核心：只能看自己的客户
	db = db.Where("owner_id = ?", ownerID)

	// 状态过滤
	if status != "" {
		db = db.Where("status = ?", status)
	}

	// 关键词搜索（姓名 + 电话）
	if keyword != "" {
		like := "%" + keyword + "%"
		db = db.Where("name LIKE ? OR phone LIKE ?", like, like)
	}

	// 统计总数
	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// 分页
	offset := (page - 1) * pageSize

	if err := db.
		Order("id DESC").
		Limit(pageSize).
		Offset(offset).
		Find(&customers).Error; err != nil {
		return nil, 0, err
	}

	return customers, total, nil
}

func UpdateCustomerNextFollowUp(customerID uint, t time.Time) error {
	return database.DB.Model(&model.Customer{}).
		Where("id = ?", customerID).
		Update("next_follow_up_at", t).Error
}
