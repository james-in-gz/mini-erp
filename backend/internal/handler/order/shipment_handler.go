package order

import (
	"backend/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CreateShipmentReq struct {
	TrackingNumber string `json:"trackingNumber"`
	Carrier        string `json:"carrier"`

	ReceiverName     string `json:"receiverName"`
	ReceiverPhone    string `json:"receiverPhone"`
	ReceiverProvince string `json:"receiverProvince"`
	ReceiverCity     string `json:"receiverCity"`
	ReceiverDistrict string `json:"receiverDistrict"`
	ReceiverAddress  string `json:"receiverAddress"`

	Items []struct {
		OrderItemID uint `json:"orderItemId"`
		Quantity    int  `json:"quantity"`
	} `json:"items"`
}

func CreateShipment(c *gin.Context) {
	orderID, err := strconv.Atoi(c.Param("id"))
	if err != nil || orderID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid order id"})
		return
	}

	var req CreateShipmentReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ❗直接传 struct，不要用 map
	err = service.CreateShipment(uint(orderID), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "shipment created"})
}

func ListShipments(c *gin.Context) {
	orderID, err := strconv.Atoi(c.Param("id"))
	if err != nil || orderID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid order id"})
		return
	}

	data, err := service.ListShipments(uint(orderID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, data)
}
