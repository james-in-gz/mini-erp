package auth

import (
	"backend/internal/dto"

	"backend/internal/service"

	"github.com/gin-gonic/gin"
)

func LoginHandler(c *gin.Context) {
	var req LoginRequest

	// 🔥 use binding with validation
	if err := c.ShouldBindJSON(&req); err != nil {
		dto.Fail(c, "invalid request params")
		return
	}

	token, err := service.Login(req.Username, req.Password)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, LoginResponse{
		Token: token,
	})
}

func MeHandler(c *gin.Context) {
	userID, _ := c.Get("userID")

	dto.Success(c, gin.H{
		"user_id": userID,
	})
}
