package handler

import (
	"backend/internal/dto"
	"backend/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GET /customers/:id/addresses
func GetAddresses(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	list, err := service.GetAddresses(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, list)
}

// POST /customers/:id/addresses
func CreateAddress(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	var req dto.CreateAddressRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := service.CreateAddress(uint(id), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "created"})
}

// POST /addresses/:id/default
func SetDefault(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	err := service.SetDefaultAddress(uint(id))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ok"})
}
