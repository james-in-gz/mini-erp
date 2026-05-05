package model

import "time"

type Customer struct {
	ID     uint   `gorm:"primaryKey" json:"id" form:"id"`
	Name   string `gorm:"size:255" json:"name" form:"name"`
	Phone  string `gorm:"size:50;uniqueIndex" json:"phone" form:"phone"`
	Email  string `gorm:"size:100" json:"email" form:"email"`
	Wechat string `gorm:"size:50" json:"wechat" form:"wechat"`

	Entry string `gorm:"size:100" json:"entry" form:"entry"` // 门店1，属于哪个业务微信号入口

	Source string `gorm:"size:100" json:"source" form:"source"`      //客户来源：朋友圈、线下门店、活动拉新、广告、公众号等
	Level  string `gorm:"size:50" json:"level" form:"level"`         //vip normal potential
	Status string `gorm:"size:50;index" json:"status" form:"status"` // new contacted in_progress won lost

	NextFollowUpAt *time.Time `gorm:"index" json:"nextFollowUpAt" form:"nextFollowUpAt"`

	OwnerID uint `gorm:"index" json:"ownerID" form:"ownerID"` // 客户归属的员工ID

	CreatedAt time.Time `json:"createdAt" form:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" form:"updatedAt"`

	Tags      []Tag             `gorm:"many2many:customer_tags" json:"tags" form:"tags"`
	Addresses []CustomerAddress `json:"addresses" form:"addresses"`
	Notes     []CustomerNote    `json:"notes" form:"notes"`
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
