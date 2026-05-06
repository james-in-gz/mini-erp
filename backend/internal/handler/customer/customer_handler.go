package customer

import (
	"backend/internal/dto"
	"backend/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

func parseUint(s string) uint {
	u, err := strconv.ParseUint(s, 10, 32)
	if err != nil {
		return 0 // or handle error appropriately
	}
	return uint(u)
}

func CreateCustomer(c *gin.Context) {
	var req CreateCustomerRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		dto.Fail(c, "invalid params")
		return
	}

	// 🔥 从 JWT 中拿当前用户（owner）
	userIDVal, exists := c.Get("userID")
	if !exists {
		dto.Fail(c, "unauthorized")
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
		dto.Fail(c, "failed to create customer")
		return
	}

	dto.Success(c, gin.H{"message": "customer created"})
}

func ListCustomers(c *gin.Context) {
	var query ListCustomersQuery

	if err := c.ShouldBindQuery(&query); err != nil {
		dto.Fail(c, "invalid query")
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
		dto.Fail(c, "unauthorized")
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
		dto.Fail(c, "failed to fetch customers")
		return
	}

	dto.Success(c, result)
}

func ListTodayFollowUps(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		dto.Fail(c, "unauthorized")
		return
	}

	userID := userIDVal.(uint)

	customers, err := service.ListTodayFollowUps(userID)
	if err != nil {
		dto.Fail(c, "failed to fetch follow-ups")
		return
	}

	dto.Success(c, gin.H{"list": customers})
}

func GetCustomerDetail(c *gin.Context) {
	idStr := c.Param("id")
	customerID := parseUint(idStr)

	userIDVal, exists := c.Get("userID")
	if !exists {
		dto.Fail(c, "unauthorized")
		return
	}

	userID := userIDVal.(uint)

	result, err := service.GetCustomerDetail(customerID, userID)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, result)
}

func GetFollowUps(c *gin.Context) {
	userID := c.GetUint("userID") // 你登录中间件里设置的

	data, err := service.GetFollowUps(userID)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, data)
}

func UpdateCustomerStatus(c *gin.Context) {
	id := c.Param("id")

	var req struct {
		Status string `json:"status"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		dto.Fail(c, "invalid request")
		return
	}

	err := service.UpdateCustomerStatus(id, req.Status)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, gin.H{"message": "ok"})
}

func UpdateCustomerBaseInfo(c *gin.Context) {
	id := c.Param("id")

	var req dto.UpdateCustomerRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		dto.Fail(c, "invalid request")
		return
	}

	err := service.UpdateCustomerBaseInfo(id, req)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, gin.H{"message": "ok"})
}

func SearchCustomers(c *gin.Context) {
	keyword := c.Query("keyword")

	list, err := service.SearchCustomers(keyword)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, list)
}
