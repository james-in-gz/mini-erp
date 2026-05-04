package service

import (
	"backend/internal/dto"
	"backend/internal/model"
	"backend/internal/repository"
)

// 获取地址
func GetAddresses(customerID uint) ([]model.CustomerAddress, error) {
	return repository.ListAddresses(customerID)
}

// 创建地址
func CreateAddress(customerID uint, req dto.CreateAddressRequest) error {

	addr := model.CustomerAddress{
		CustomerID: customerID,
		Name:       req.Name,
		Phone:      req.Phone,
		Province:   req.Province,
		City:       req.City,
		District:   req.District,
		Address:    req.Address,
	}

	return repository.CreateAddress(&addr)
}

// 设置默认地址 ⭐（关键逻辑）
func SetDefaultAddress(addressID uint) error {

	// 1. 找到地址
	target, err := repository.GetAddressByID(addressID)
	if err != nil {
		return err
	}

	// 2. 清空该客户的默认地址
	if err := repository.ClearDefault(target.CustomerID); err != nil {
		return err
	}

	// 3. 设置新的默认地址
	return repository.SetDefaultAddress(addressID)
}
