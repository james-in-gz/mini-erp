package customer

import (
	"net/http"

	"backend/internal/service"
	"github.com/gin-gonic/gin"
)

func CreateCustomer(c *gin.Context) {
	var req CreateCustomerRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid params",
		})
		return
	}

	// 🔥 从 JWT 中拿当前用户（owner）
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID := userIDVal.(uint)

	err := service.CreateCustomer(service.CreateCustomerInput{
		Name:    req.Name,
		Phone:   req.Phone,
		Email:   req.Email,
		Source:  req.Source,
		OwnerID: userID,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to create customer",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "customer created",
	})
}

func ListCustomers(c *gin.Context) {
	var query ListCustomersQuery

	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid query"})
		return
	}

	// 默认分页
	if query.Page <= 0 {
		query.Page = 1
	}
	if query.PageSize <= 0 || query.PageSize > 50 {
		query.PageSize = 10
	}

	// 🔥 从 JWT 获取当前用户
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID := userIDVal.(uint)

	result, err := service.ListCustomers(service.ListCustomersInput{
		Page:     query.Page,
		PageSize: query.PageSize,
		Status:   query.Status,
		Keyword:  query.Keyword,
		OwnerID:  userID,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch customers"})
		return
	}

	c.JSON(http.StatusOK, result)
}

func ListTodayFollowUps(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID := userIDVal.(uint)

	customers, err := service.ListTodayFollowUps(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to fetch follow-ups",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"list": customers,
	})
}

func GetCustomerDetail(c *gin.Context) {
	idStr := c.Param("id")
	customerID := parseUint(idStr)

	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID := userIDVal.(uint)

	result, err := service.GetCustomerDetail(customerID, userID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}
