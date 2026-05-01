package model

import "time"

type Customer struct {
	ID        uint   `gorm:"primaryKey"`
	Name      string `gorm:"size:255"`
	Phone     string `gorm:"size:50;index"`
	Email     string `gorm:"size:100"`

	Source    string `gorm:"size:100"`
	Level     string `gorm:"size:50"`
	Status    string `gorm:"size:50;index"`

	OwnerID   uint   `gorm:"index"`

	CreatedAt time.Time
	UpdatedAt time.Time

	Tags      []Tag `gorm:"many2many:customer_tags"`
}
