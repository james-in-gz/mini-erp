package handler

import (
	"backend/internal/dto"
	"backend/internal/model"
	"backend/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func ListWarehouses(c *gin.Context) {
	warehouses, err := service.GetWarehouses()
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}
	dto.Success(c, warehouses)
}

func CreateWarehouse(c *gin.Context) {
	var wh model.Warehouse
	if err := c.ShouldBindJSON(&wh); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request_body"})
		return
	}
	if err := service.CreateWarehouse(&wh); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, wh)
}

func UpdateWarehouse(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_warehouse_id"})
		return
	}
	var wh model.Warehouse
	if err := c.ShouldBindJSON(&wh); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request_body"})
		return
	}
	if err := service.UpdateWarehouse(uint(id), &wh); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, wh)
}

func DeleteWarehouse(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_warehouse_id"})
		return
	}
	if err := service.DeleteWarehouse(uint(id)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "warehouse_deleted_successfully"})
}
