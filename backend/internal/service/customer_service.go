package service

import (
	"backend/internal/dto"
	"backend/internal/model"
	"backend/internal/repository"
	"errors"
	"time"

	"gorm.io/gorm"
)

type CreateCustomerInput struct {
	Name    string
	Phone   string
	Email   string
	Source  string
	OwnerID uint
}

func CreateCustomer(input CreateCustomerInput) error {
	_, err := repository.GetCustomerByPhone(input.Phone)

	if err == nil {
		// found
		return errors.New("customer already exists")
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		// real DB error
		return err
	}

	// not found → safe to create
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
	Total int64            `json:"total"`
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
	Customer       *model.Customer      `json:"customer"`
	Notes          []model.CustomerNote `json:"notes"`
	LatestNote     *model.CustomerNote  `json:"latestNote"`
	NextFollowUpAt *time.Time           `json:"nextFollowUpAt"`
	IsOverdue      bool                 `json:"isOverdue"`
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
	notes, _ := repository.ListCustomerNotesWithPagination(customerID, 20, 0)

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

type FollowUpGroup struct {
	Overdue  []model.Customer `json:"overdue"`
	Today    []model.Customer `json:"today"`
	Upcoming []model.Customer `json:"upcoming"`
}

func GetFollowUps(ownerID uint) (FollowUpGroup, error) {
	customers, err := repository.ListCustomersWithFollowUp(ownerID)
	if err != nil {
		return FollowUpGroup{}, err
	}

	loc, _ := time.LoadLocation("Asia/Shanghai") // 统一业务时区
	now := time.Now().In(loc)

	todayStart := time.Date(
		now.Year(), now.Month(), now.Day(),
		0, 0, 0, 0,
		loc,
	)
	todayEnd := todayStart.Add(24 * time.Hour)

	var result = FollowUpGroup{
		Overdue:  []model.Customer{},
		Today:    []model.Customer{},
		Upcoming: []model.Customer{},
	}

	for _, c := range customers {
		if c.NextFollowUpAt == nil {
			continue
		}

		next := c.NextFollowUpAt.In(loc)

		// ⭐ 推荐逻辑（更符合 CRM）
		if next.Before(todayStart) {
			result.Overdue = append(result.Overdue, c)
		} else if next.Before(todayEnd) {
			result.Today = append(result.Today, c)
		} else {
			result.Upcoming = append(result.Upcoming, c)
		}
	}

	return result, nil
}

func UpdateCustomerStatus(id string, status string) error {
	return repository.UpdateCustomerStatus(id, status)
}

func UpdateCustomerBaseInfo(id string, req dto.UpdateCustomerRequest) error {
	return repository.UpdateCustomerBaseInfo(id, req)
}

func SearchCustomers(keyword string) ([]model.Customer, error) {
	return repository.Search(keyword)
}
