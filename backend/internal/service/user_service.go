package service

import (
	"errors"

	"backend/internal/model"
	"backend/internal/repository"
	"backend/pkg/utils"
)

type CreateUserInput struct {
	Username string
	Password string
	Email    string
}

func CreateUser(input CreateUserInput) error {
	// 1️⃣ 检查用户是否存在
	existing, _ := repository.GetUserByUsername(input.Username)
	if existing != nil && existing.ID != 0 {
		return errors.New("user already exists")
	}

	// 2️⃣ 密码加密
	hash, err := utils.HashPassword(input.Password)
	if err != nil {
		return err
	}

	// 3️⃣ 构建用户
	user := model.User{
		Username:     input.Username,
		PasswordHash: hash,
		Email:        input.Email,
		Status:       "active",
	}

	// 4️⃣ 写数据库
	return repository.CreateUser(&user)
}
