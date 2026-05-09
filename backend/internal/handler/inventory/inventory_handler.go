package inventory

import (
	"backend/internal/dto"
	"backend/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// HandleGetBySKU 获取SKU库存
func HandleGetBySKU(c *gin.Context) {
	skuID, err := strconv.ParseUint(c.Param("skuId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的SKU ID"})
		return
	}

	inv, err := service.GetBySKUID(uint(skuID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "库存记录不存在"})
		return
	}

	c.JSON(http.StatusOK, inv)
}

// HandleBatchGet 批量获取SKU库存
func HandleBatchGet(c *gin.Context) {
	var req struct {
		SKUIDs []uint `json:"skuIds"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	inventories, err := service.BatchGetBySKUIDs(req.SKUIDs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, inventories)
}

// HandleBatchCheck 批量检查库存
func HandleBatchCheck(c *gin.Context) {
	var req service.BatchCheckRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := service.BatchCheckStock(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}

// HandleAdjust 管理员调整库存
func HandleAdjust(c *gin.Context) {
	var req struct {
		SKUID    uint   `json:"skuId" binding:"required"`
		Quantity int    `json:"quantity" binding:"required"`
		Remark   string `json:"remark"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 从上下文中获取操作人（假设JWT中间件设置）
	userIDVal, exists := c.Get("userID")
	if !exists {
		dto.Fail(c, "unauthorized")
		return
	}

	err := service.AdjustStock(req.SKUID, req.Quantity, req.Remark, userIDVal.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "库存调整成功"})
}

// HandleGetLogs 获取库存日志
func HandleGetLogs(c *gin.Context) {
	skuID, err := strconv.ParseUint(c.Param("skuId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的SKU ID"})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "20"))

	logs, total, err := service.GetLogs(uint(skuID), page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"items":    logs,
		"total":    total,
		"page":     page,
		"pageSize": pageSize,
	})
}
