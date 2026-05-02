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

type ListCustomersInput struct {
	Page     int
	PageSize int
	Status   string
	Keyword  string
	OwnerID  uint
}

type ListCustomersOutput struct {
	Total int64           `json:"total"`
	List  []model.Customer `json:"list"`
}

func ListCustomers(input ListCustomersInput) (*ListCustomersOutput, error) {
	customers, total, err := repository.ListCustomers(
		input.Page,
		input.PageSize,
		input.OwnerID,
		input.Status,
		input.Keyword,
	)
	if err != nil {
		return nil, err
	}

	return &ListCustomersOutput{
		Total: total,
		List:  customers,
	}, nil
}

func ListTodayFollowUps(ownerID uint) ([]model.Customer, error) {
	return repository.ListTodayFollowUps(ownerID)
}
