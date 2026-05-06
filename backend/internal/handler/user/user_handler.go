package user

import (
	"backend/internal/dto"

	"backend/internal/service"

	"github.com/gin-gonic/gin"
)

func CreateUser(c *gin.Context) {
	var req CreateUserRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		dto.Fail(c, "invalid params")
		return
	}

	err := service.CreateUser(service.CreateUserInput{
		Username: req.Username,
		Password: req.Password,
		Email:    req.Email,
	})

	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, gin.H{"message": "user created"})
}
