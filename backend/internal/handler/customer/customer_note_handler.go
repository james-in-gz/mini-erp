package customer

import (
	"backend/internal/dto"
	"time"

	"backend/internal/service"

	"github.com/gin-gonic/gin"
)

func CreateCustomerNote(c *gin.Context) {
	var req CreateCustomerNoteRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		dto.Fail(c, "invalid params")
		return
	}

	// customer id
	customerID := c.Param("id")

	// 当前用户
	userIDVal, _ := c.Get("userID")
	userID := userIDVal.(uint)

	// 解析时间
	var nextFollowUp *time.Time
	if req.NextFollowUpAt != nil {
		t, err := time.Parse(time.RFC3339, *req.NextFollowUpAt)
		if err == nil {
			nextFollowUp = &t
		}
	}

	err := service.CreateCustomerNote(service.CreateCustomerNoteInput{
		CustomerID:     parseUint(customerID),
		UserID:         userID,
		Content:        req.Content,
		Type:           req.Type,
		NextFollowUpAt: nextFollowUp,
	})

	if err != nil {
		dto.Fail(c, "failed")
		return
	}

	dto.Success(c, gin.H{"message": "note added"})
}

func ListCustomerNotes(c *gin.Context) {
	customerID := parseUint(c.Param("id"))

	notes, err := service.ListCustomerNotes(customerID)
	if err != nil {
		dto.Fail(c, "failed")
		return
	}

	dto.Success(c, notes)
}
