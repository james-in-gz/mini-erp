package order

import (
	"backend/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateOrder(c *gin.Context) {
	var req service.CreateOrderReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := service.CreateOrder(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ok"})
}

func GetOrders(c *gin.Context) {
	orders, _ := service.GetOrders()
	c.JSON(http.StatusOK, orders)
}

func AddShipping(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	var body struct {
		Tracking string `json:"tracking"`
	}

	c.ShouldBindJSON(&body)

	service.AddShipping(uint(id), body.Tracking)

	c.JSON(http.StatusOK, gin.H{"message": "shipped"})
}
