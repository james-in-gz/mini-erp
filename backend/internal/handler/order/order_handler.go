package order

import (
	"backend/internal/dto"
	"backend/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateOrder(c *gin.Context) {
	var req service.CreateOrderReq

	if err := c.ShouldBindJSON(&req); err != nil {
		dto.Fail(c, err.Error())
		return
	}

	order, err := service.CreateOrder(req)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, order)
}

func GetOrders(c *gin.Context) {
	orders, err := service.GetOrders()
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}
	dto.Success(c, orders)
}

func AddShipping(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		dto.Fail(c, "invalid order id")
		return
	}

	var body struct {
		Tracking string `json:"tracking"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		dto.Fail(c, err.Error())
		return
	}

	err = service.AddShipping(uint(id), body.Tracking)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, gin.H{"message": "shipped"})
}

func GetOrderByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		dto.Fail(c, "invalid order id")
		return
	}

	order, err := service.GetOrderByID(uint(id))
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, order)
}

func UpdateOrderAddress(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		dto.Fail(c, "invalid order id")
		return
	}

	var req = struct {
		CustomerAddressID uint `json:"customerAddressId"`
	}{}
	if err := c.ShouldBindJSON(&req); err != nil {
		dto.Fail(c, err.Error())
		return
	}

	err = service.ChangeOrderAddress(uint(id), req.CustomerAddressID)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, gin.H{"message": "address updated"})
}

func CancelOrder(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		dto.Fail(c, "invalid order id")
		return
	}

	err = service.CancelOrder(uint(id))
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, gin.H{"message": "order cancelled"})
}
