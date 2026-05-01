package service

import (
	"backend/internal/model"
	"backend/internal/repository"
)

type CreateCustomerInput struct {
	Name    string
	Phone   string
	Email   string
	Source  string
	OwnerID uint
}

func CreateCustomer(input CreateCustomerInput) error {
	customer := model.Customer{
		Name:    input.Name,
		Phone:   input.Phone,
		Email:   input.Email,
		Source:  input.Source,
		Status:  "new", // 默认状态
		OwnerID: input.OwnerID,
	}

	return repository.CreateCustomer(&customer)
}
