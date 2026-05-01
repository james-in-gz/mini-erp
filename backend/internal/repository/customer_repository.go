package repository

import (
	"backend/internal/database"
	"backend/internal/model"
)

func CreateCustomer(customer *model.Customer) error {
	return database.DB.Create(customer).Error
}
