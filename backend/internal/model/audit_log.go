package model

import "time"

type AuditLog struct {
	ID         uint      `gorm:"primaryKey"`
	UserID     uint

	EntityType string    `gorm:"size:50"`
	EntityID   uint

	Action     string    `gorm:"size:50"`

	Changes    string    `gorm:"type:json"`

	CreatedAt  time.Time
}
