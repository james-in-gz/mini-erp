package model

import "time"

type User struct {
	ID           uint      `gorm:"primaryKey"`
	Username     string    `gorm:"uniqueIndex;size:100"`
	PasswordHash string
	Email        string    `gorm:"size:150"`

	Status       string    `gorm:"default:active"`

	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type Role struct {
	ID   uint   `gorm:"primaryKey"`
	Name string `gorm:"uniqueIndex"`
}

type UserRole struct {
	UserID uint `gorm:"primaryKey"`
	RoleID uint `gorm:"primaryKey"`
}
