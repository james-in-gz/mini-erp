package repository

import (
	"backend/internal/database"
	"backend/internal/model"
)

func GetUserByUsername(username string) (*model.User, error) {
	var user model.User
	err := database.DB.Where("username = ?", username).First(&user).Error
	return &user, err
}

func CreateUser(user *model.User) error {
	return database.DB.Create(user).Error
}

func GetUserById(id uint) (*model.User, error) {
	var user model.User
	err := database.DB.Where("id = ?", id).First(&user).Error
	return &user, err
}
