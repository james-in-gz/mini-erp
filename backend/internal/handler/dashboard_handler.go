package handler

import (
	"backend/internal/service"

	"github.com/gin-gonic/gin"
)

func GetDashboard(c *gin.Context) {
	userID := c.GetUint("userID")
	data, err := service.GetDashboard(userID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, data)
}
