package order

import (
	"backend/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CreateShipmentReq struct {
	TrackingNumber string `json:"tracking_number"`
	Carrier        string `json:"carrier"`

	ReceiverName  string `json:"receiver_name"`
	ReceiverPhone string `json:"receiver_phone"`
	ReceiverAddr  string `json:"receiver_addr"`

	Items []struct {
		OrderItemID uint `json:"order_item_id"`
		Quantity    int  `json:"quantity"`
	} `json:"items"`
}

func CreateShipment(c *gin.Context) {
	orderID, _ := strconv.Atoi(c.Param("id"))

	var req CreateShipmentReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := service.CreateShipment(uint(orderID), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "shipment created"})
}

func ListShipments(c *gin.Context) {
	orderID, _ := strconv.Atoi(c.Param("id"))

	data, err := service.ListShipments(uint(orderID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, data)
}
