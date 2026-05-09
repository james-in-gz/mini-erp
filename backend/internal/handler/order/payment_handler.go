package order

import (
	"backend/internal/dto"
	"backend/internal/service"

	"github.com/gin-gonic/gin"
)

func CreatePayment(c *gin.Context) {

	orderID := c.Param("id")

	var req dto.CreatePaymentRequest

	if err := c.ShouldBindJSON(&req); err != nil {

		c.JSON(400, gin.H{
			"error": err.Error(),
		})

		return
	}

	err := service.CreatePayment(
		orderID,
		req.Amount,
		req.Method,
		req.Remark,
	)

	if err != nil {

		c.JSON(400, gin.H{
			"error": err.Error(),
		})

		return
	}

	c.JSON(200, gin.H{
		"message": "payment created",
	})
}
