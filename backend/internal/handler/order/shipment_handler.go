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
	orderID, _ := strconv.Atoi(c.Param("id"))

	var req CreateShipmentReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	serviceReq := map[string]interface{}{
		"TrackingNumber":   req.TrackingNumber,
		"Carrier":          req.Carrier,
		"ReceiverName":     req.ReceiverName,
		"ReceiverPhone":    req.ReceiverPhone,
		"ReceiverProvince": req.ReceiverProvince,
		"ReceiverCity":     req.ReceiverCity,
		"ReceiverDistrict": req.ReceiverDistrict,
		"ReceiverAddress":  req.ReceiverAddress,
		"Items":            req.Items,
	}

	err := service.CreateShipment(uint(orderID), serviceReq)
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
