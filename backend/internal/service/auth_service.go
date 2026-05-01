package service

import (
	"errors"

	"backend/internal/repository"
	"backend/pkg/utils"
)

func Login(username, password string) (string, error) {
	// 1️⃣ 查用户
	user, err := repository.GetUserByUsername(username)
	if err != nil {
		return "", errors.New("invalid username or password")
	}

	// 2️⃣ 校验状态
	if user.Status != "active" {
		return "", errors.New("user disabled")
	}

	// 3️⃣ 校验密码
	if !utils.CheckPassword(password, user.PasswordHash) {
		return "", errors.New("invalid username or password")
	}

	// 4️⃣ 生成 token
	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		return "", err
	}

	return token, nil
}
