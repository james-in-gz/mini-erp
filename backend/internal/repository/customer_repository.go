package repository

import (
	"backend/internal/database"
	"backend/internal/dto"
	"backend/internal/model"
	"time"
)

func CreateCustomer(customer *model.Customer) error {
	return database.DB.Create(customer).Error
}

func UpdateCustomerStatus(id string, status string) error {
	return database.DB.Model(&model.Customer{}).
		Where("id = ?", id).
		Update("status", status).Error
}

func GetCustomerByID(id uint) (*model.Customer, error) {
	var customer model.Customer

	err := database.DB.First(&customer, id).Error
	if err != nil {
		return nil, err
	}

	return &customer, nil
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

func ListTodayFollowUps(ownerID uint) ([]model.Customer, error) {
	var customers []model.Customer

	now := time.Now()

	err := database.DB.
		Where("owner_id = ?", ownerID).
		Where("next_follow_up_at IS NOT NULL").
		Where("next_follow_up_at <= ?", now).
		Where("status IN ?", []string{"interested", "negotiating"}).
		Order("next_follow_up_at ASC").
		Find(&customers).Error

	return customers, err
}

func CountTodayFollowUps(start, end time.Time) (int64, error) {
	var count int64

	err := database.DB.Model(&model.Customer{}).
		Where("next_follow_up_at BETWEEN ? AND ?", start, end).
		Count(&count).Error

	return count, err
}

func CountOverdue(now time.Time) (int64, error) {
	var count int64

	err := database.DB.Model(&model.Customer{}).
		Where("next_follow_up_at < ?", now).
		Count(&count).Error

	return count, err
}

func CountDone(end time.Time) (int64, error) {
	var count int64

	err := database.DB.Model(&model.Customer{}).
		Where("next_follow_up_at > ?", end).
		Count(&count).Error

	return count, err
}

func ListCustomersWithFollowUp(ownerID uint) ([]model.Customer, error) {
	var customers []model.Customer

	err := database.DB.
		Where("owner_id = ?", ownerID).
		Where("next_follow_up_at IS NOT NULL").
		Where("status IN ?", []string{"interested", "negotiating"}).
		Order("next_follow_up_at ASC").
		Find(&customers).Error

	return customers, err
}

func UpdateCustomerBaseInfo(id string, req dto.UpdateCustomerRequest) error {

	return database.DB.Model(&model.Customer{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"name":   req.Name,
			"phone":  req.Phone,
			"wechat": req.Wechat,
			"source": req.Source,
			"entry":  req.Entry,
			"status": req.Status,
		}).Error
}
