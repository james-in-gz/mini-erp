package order

import (
	"backend/internal/dto"
	"backend/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateShipment(c *gin.Context) {
	orderID, err := strconv.Atoi(c.Param("id"))
	if err != nil || orderID <= 0 {
		dto.Fail(c, "invalid order id")
		return
	}

	var req dto.CreateShipmentReq
	if err := c.ShouldBindJSON(&req); err != nil {
		dto.Fail(c, err.Error())
		return
	}

	err = service.CreateShipment(uint(orderID), req)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, gin.H{"message": "shipment created"})
}

func ListShipments(c *gin.Context) {
	orderID, err := strconv.Atoi(c.Param("id"))
	if err != nil || orderID <= 0 {
		dto.Fail(c, "invalid order id")
		return
	}

	data, err := service.ListShipments(uint(orderID))
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, data)

}

func CreateShipmentByExpress(c *gin.Context) {
	orderID, err := strconv.Atoi(c.Param("id"))
	if err != nil || orderID <= 0 {
		dto.Fail(c, "invalid order id")
		return
	}

	var req dto.CreateShipmentByExpressReq
	if err := c.ShouldBindJSON(&req); err != nil {
		dto.Fail(c, err.Error())
		return
	}

	respnose, err := service.CreateShipmentByExpress(uint(orderID), req)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, respnose)
}

func GetExpressLabel(c *gin.Context) {
	waybillNo := c.Query("waybillNo")

	if waybillNo == "" {
		dto.Fail(c, "waybillNo is required")
		return
	}

	res, err := service.GetExpressLabel(waybillNo)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, res)
}
