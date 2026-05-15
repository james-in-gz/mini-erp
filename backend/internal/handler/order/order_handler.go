package order

import (
	"backend/internal/dto"
	"backend/internal/service"
	"strconv"
	"time"

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
	var q dto.OrderQuery

	if err := c.ShouldBindQuery(&q); err != nil {
		dto.Fail(c, err.Error())
		return
	}

	// 默认值
	if q.Page <= 0 {
		q.Page = 1
	}

	if q.PageSize <= 0 {
		q.PageSize = 10
	}

	data, total, err := service.GetOrders(q)

	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, gin.H{
		"data":     data,
		"total":    total,
		"page":     q.Page,
		"pageSize": q.PageSize,
	})
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

func UpdateNextDeliveryTime(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		dto.Fail(c, "invalid order id")
		return
	}

	var req struct {
		NextDeliveryAt *time.Time `json:"nextDeliveryAt"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		dto.Fail(c, err.Error())
		return
	}

	err = service.UpdateOrderNextDeliveryTime(uint(id), req.NextDeliveryAt)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, gin.H{"message": "next delivery time updated"})
}
