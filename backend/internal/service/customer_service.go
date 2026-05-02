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

type CustomerDetailOutput struct {
	Customer         *model.Customer      `json:"customer"`
	Notes            []model.CustomerNote `json:"notes"`
	LatestNote       *model.CustomerNote  `json:"latest_note"`
	NextFollowUpAt   *time.Time           `json:"next_follow_up_at"`
	IsOverdue        bool                 `json:"is_overdue"`
}

func GetCustomerDetail(customerID uint, ownerID uint) (*CustomerDetailOutput, error) {
	// 1️⃣ 获取客户
	customer, err := repository.GetCustomerByID(customerID)
	if err != nil {
		return nil, err
	}

	// 🔥 私域限制（必须做）
	if customer.OwnerID != ownerID {
		return nil, errors.New("no permission")
	}

	// 2️⃣ 获取 notes
	notes, _ := repository.ListCustomerNotes(customerID,20,0)

	// 3️⃣ 最新 note
	latestNote, _ := repository.GetLatestCustomerNote(customerID)

	// 4️⃣ 是否 overdue
	isOverdue := false
	if customer.NextFollowUpAt != nil {
		isOverdue = customer.NextFollowUpAt.Before(time.Now())
	}

	return &CustomerDetailOutput{
		Customer:       customer,
		Notes:          notes,
		LatestNote:     latestNote,
		NextFollowUpAt: customer.NextFollowUpAt,
		IsOverdue:      isOverdue,
	}, nil
}
