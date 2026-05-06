package handler

import (
	"backend/internal/dto"
	"backend/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GET /customers/:id/addresses
func GetAddresses(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		dto.Fail(c, "invalid customer id")
		return
	}

	list, err := service.GetAddresses(uint(id))
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, list)
}

// POST /customers/:id/addresses
func CreateAddress(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		dto.Fail(c, "invalid customer id")
		return
	}

	var req dto.CreateAddressRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		dto.Fail(c, err.Error())
		return
	}

	err = service.CreateAddress(uint(id), req)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, gin.H{"message": "created"})
}

// POST /addresses/:id/default
func SetDefault(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		dto.Fail(c, "invalid address id")
		return
	}

	err = service.SetDefaultAddress(uint(id))
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, gin.H{"message": "ok"})
}
