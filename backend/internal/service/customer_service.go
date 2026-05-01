package service

import (
	"errors"
	"gorm.io/gorm"
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
	existing, err := repository.GetCustomerByPhone(input.Phone)

	if err == nil && existing != nil {
		return errors.New("customer already exists")
	}

	// 如果是其他错误（不是未找到）
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	customer := model.Customer{
		Name:    input.Name,
		Phone:   input.Phone,
		Email:   input.Email,
		Source:  input.Source,
		Status:  "new",
		OwnerID: input.OwnerID,
	}

	return repository.CreateCustomer(&customer)
}
