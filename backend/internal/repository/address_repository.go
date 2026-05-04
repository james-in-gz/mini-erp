package repository

import (
	"backend/internal/database"
	"backend/internal/model"
)

// 获取客户地址
func ListAddresses(customerID uint) ([]model.CustomerAddress, error) {
	var list []model.CustomerAddress
	err := database.DB.
		Where("customer_id = ?", customerID).
		Find(&list).Error
	return list, err
}

// 创建地址
func CreateAddress(addr *model.CustomerAddress) error {
	return database.DB.Create(addr).Error
}

// 清除默认地址
func ClearDefault(customerID uint) error {
	return database.DB.
		Model(&model.CustomerAddress{}).
		Where("customer_id = ?", customerID).
		Update("is_default", false).Error
}

// 设置默认地址
func SetDefaultAddress(id uint) error {
	return database.DB.
		Model(&model.CustomerAddress{}).
		Where("id = ?", id).
		Update("is_default", true).Error
}

func GetAddressByID(id uint) (model.CustomerAddress, error) {
	var addr model.CustomerAddress
	err := database.DB.First(&addr, id).Error
	return addr, err
}
