package model

import "time"

type Customer struct {
	ID        uint   `gorm:"primaryKey"`
	Name      string `gorm:"size:255"`
	Phone     string `gorm:"size:50;uniqueIndex"`
	Email     string `gorm:"size:100"`

	Source    string `gorm:"size:100"`
	Level     string `gorm:"size:50"`
	Status    string `gorm:"size:50;index"`

	NextFollowUpAt *time.Time `gorm:"index"`
	
	OwnerID   uint   `gorm:"index"`

	CreatedAt time.Time
	UpdatedAt time.Time

	Tags      []Tag `gorm:"many2many:customer_tags"`
}

type Tag struct {
	ID    uint   `gorm:"primaryKey"`
	Name  string `gorm:"uniqueIndex"`
	Color string
}

type CustomerTag struct {
	CustomerID uint `gorm:"primaryKey"`
	TagID      uint `gorm:"primaryKey"`
}

type CustomerNote struct {
	ID              uint      `gorm:"primaryKey"`
	CustomerID      uint      `gorm:"index"`
	UserID          uint
	Content         string    `gorm:"type:text"`
	Type       string     `gorm:"size:50"` // call / visit / message
	
	NextFollowUpAt  *time.Time

	CreatedAt       time.Time
}

