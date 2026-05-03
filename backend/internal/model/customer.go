package model

import "time"

type Customer struct {
	ID    uint   `gorm:"primaryKey" json:"id" form:"id"`
	Name  string `gorm:"size:255" json:"name" form:"name"`
	Phone string `gorm:"size:50;uniqueIndex" json:"phone" form:"phone"`
	Email string `gorm:"size:100" json:"email" form:"email"`

	Source string `gorm:"size:100" json:"source" form:"source"`
	Level  string `gorm:"size:50" json:"level" form:"level"`
	Status string `gorm:"size:50;index" json:"status" form:"status"`

	NextFollowUpAt *time.Time `gorm:"index" json:"nextFollowUpAt" form:"nextFollowUpAt"`

	OwnerID uint `gorm:"index" json:"ownerID" form:"ownerID"`

	CreatedAt time.Time `json:"createdAt" form:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" form:"updatedAt"`

	Tags []Tag `gorm:"many2many:customer_tags" json:"tags" form:"tags"`
}

type Tag struct {
	ID    uint   `gorm:"primaryKey" json:"id" form:"id"`
	Name  string `gorm:"uniqueIndex" json:"name" form:"name"`
	Color string `json:"color" form:"color"`
}

type CustomerTag struct {
	CustomerID uint `gorm:"primaryKey" json:"customerID" form:"customerID"`
	TagID      uint `gorm:"primaryKey" json:"tagID" form:"tagID"`
}

type CustomerNote struct {
	ID         uint   `gorm:"primaryKey" json:"id" form:"id"`
	CustomerID uint   `gorm:"index" json:"customerID" form:"customerID"`
	UserID     uint   `json:"userID" form:"userID"`
	Content    string `gorm:"type:text" json:"content" form:"content"`
	Type       string `gorm:"size:50" json:"type" form:"type"` // call / visit / message

	NextFollowUpAt *time.Time `json:"nextFollowUpAt" form:"nextFollowUpAt"`

	CreatedAt time.Time `json:"createdAt" form:"createdAt"`
}
