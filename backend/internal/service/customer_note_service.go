package service

import (
	"backend/internal/model"
	"backend/internal/repository"
)

type CreateCustomerNoteInput struct {
	CustomerID      uint
	UserID          uint
	Content         string
	Type            string
	NextFollowUpAt  *time.Time
}

func CreateCustomerNote(input CreateCustomerNoteInput) error {
	note := model.CustomerNote{
		CustomerID:     input.CustomerID,
		UserID:         input.UserID,
		Content:        input.Content,
		Type:           input.Type,
		NextFollowUpAt: input.NextFollowUpAt,
	}

	// 更新客户的下一次跟进时间
	if input.NextFollowUpAt != nil {
		repository.UpdateCustomerNextFollowUp(input.CustomerID, *input.NextFollowUpAt)
	}

	return repository.CreateCustomerNote(&note)
}
