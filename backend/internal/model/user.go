package model

import "time"

type User struct {
	ID           uint      `gorm:"primaryKey"`
	Username     string    `gorm:"uniqueIndex;size:100"`
	PasswordHash string
	Email        string    `gorm:"size:150"`

	Status       string    `gorm:"default:active"`
	Role 		 string	   `gorm:"size:50"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}


