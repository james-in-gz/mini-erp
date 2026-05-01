package model

import "time"

type Product struct {
	ID        uint      `gorm:"primaryKey"`
	Name      string    `gorm:"size:255"`
	Price     float64
	Status    string    `gorm:"size:50"`

	CreatedAt time.Time
	UpdatedAt time.Time
}
