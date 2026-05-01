package customer

import (
	"net/http"

	"backend/internal/service"
	"github.com/gin-gonic/gin"
)

func CreateCustomer(c *gin.Context) {
	var req CreateCustomerRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid params",
		})
		return
	}

	// 🔥 从 JWT 中拿当前用户（owner）
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID := userIDVal.(uint)

	err := service.CreateCustomer(service.CreateCustomerInput{
		Name:    req.Name,
		Phone:   req.Phone,
		Email:   req.Email,
		Source:  req.Source,
		OwnerID: userID,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to create customer",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "customer created",
	})
}
