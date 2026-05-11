package handler

import (
	"backend/internal/dto"
	"backend/internal/service"

	"github.com/gin-gonic/gin"
)

func GetWarehouses(c *gin.Context) {
	warehouses, err := service.GetWarehouses()
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}
	dto.Success(c, warehouses)
}
