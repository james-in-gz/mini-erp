package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ximing/mini-erp/pkg/utils"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func LoginHandler(c *gin.Context) {
	var req LoginRequest
	_ = c.ShouldBindJSON(&req)

	// TODO: Replace with DB check
	if req.Username != "admin" || req.Password != "123456" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	token, _ := utils.GenerateToken(1)

	c.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}

func MeHandler(c *gin.Context) {
	userID, _ := c.Get("userID")

	c.JSON(http.StatusOK, gin.H{
		"user_id": userID,
	})
}
