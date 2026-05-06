package handler

import (
	"backend/internal/dto"
	"backend/internal/service"

	"github.com/gin-gonic/gin"
)

func GetDashboard(c *gin.Context) {
	userID := c.GetUint("userID")
	data, err := service.GetDashboard(userID)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, data)
}
