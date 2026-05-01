package database

import (
	"log"

	"backend/internal/model"
	"backend/pkg/utils"
)

func Seed() {
	createAdmin()
}

func createAdmin() {
	var count int64
	DB.Model(&model.User{}).Where("username = ?", "admin").Count(&count)

	if count > 0 {
		return
	}

	hash, err := utils.HashPassword("123456")
	if err != nil {
		log.Fatal("❌ failed to hash password:", err)
	}

	admin := model.User{
		Username:     "admin",
		PasswordHash: hash,
		Status:       "active",
		Role: "admin",
	}

	if err := DB.Create(&admin).Error; err != nil {
		log.Fatal("❌ failed to create admin:", err)
	}

	log.Println("✅ default admin created (username: admin, password: 123456)")
}
