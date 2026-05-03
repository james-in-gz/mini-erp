package model

import "time"

type AuditLog struct {
	ID     uint `gorm:"primaryKey" json:"id,omitempty"`
	UserID uint `json:"userID,omitempty"`

	EntityType string `gorm:"size:50" json:"entityType,omitempty"`
	EntityID   uint   `json:"entityID,omitempty"`

	Action string `gorm:"size:50" json:"action,omitempty"`

	Changes string `gorm:"type:json" json:"changes,omitempty"`

	CreatedAt time.Time `json:"createdAt,omitempty"`
}
