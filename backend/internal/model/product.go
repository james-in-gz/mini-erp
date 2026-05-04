package model

import "time"

type Product struct {
	ID        uint      `gorm:"primaryKey" json:"id,omitempty"`
	Name      string    `gorm:"size:255" json:"name,omitempty"`
	Price     float64   `json:"price,omitempty"`
	Status    string    `gorm:"size:50" json:"status,omitempty"`
	Stock     int       `json:"stock,omitempty"`
	CreatedAt time.Time `json:"createdAt,omitempty"`
	UpdatedAt time.Time `json:"updatedAt,omitempty"`
}
