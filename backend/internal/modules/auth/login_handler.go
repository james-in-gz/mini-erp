package auth

import (
	"net/http"
	"github.com/ximing/mini-erp/internal/repository"
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

	// 1️⃣ 查数据库
	user, err := repository.GetUserByUsername(req.Username)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not found"})
		return
	}

	// 2️⃣ 校验密码
	if !utils.CheckPassword(req.Password, user.PasswordHash) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "wrong password"})
		return
	}

	// 3️⃣ 生成 JWT
	token, _ := utils.GenerateToken(user.ID)

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
