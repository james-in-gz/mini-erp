package handler

import (
	"backend/internal/service"

	"github.com/gin-gonic/gin"
)

func GetDashboard(c *gin.Context) {
	data, err := service.GetDashboard()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, data)
}
