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
