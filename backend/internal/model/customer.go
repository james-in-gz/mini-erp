package model

import "time"

type Customer struct {
	ID     uint   `gorm:"primaryKey" json:"id" form:"id"`
	Name   string `gorm:"size:255" json:"name" form:"name"`
	Phone  string `gorm:"size:50;uniqueIndex" json:"phone" form:"phone"`
	Email  string `gorm:"size:100" json:"email" form:"email"`
	Wechat string `gorm:"size:50" json:"wechat" form:"wechat"`

	Entry string `gorm:"size:100" json:"entry" form:"entry"` // 门店1，属于哪个业务微信号入口

	Source        string `gorm:"size:100" json:"source" form:"source"`              //客户来源：朋友圈、线下门店、活动拉新、广告、公众号等
	Level         string `gorm:"size:50" json:"level" form:"level"`                 //potential new casual regular vip super_vip 对应生命周期 'new' | 'growing' | 'mature' | 'vip' | 'churn'
	LifetimeLevel string `gorm:"size:50" json:"lifetimeLevel" form:"lifetimeLevel"` // 终身客户等级，基于累计消费金额评定
	Status        string `gorm:"size:50;index" json:"status" form:"status"`         // new interested negotiating won slept lost

	NextFollowUpAt *time.Time `gorm:"index" json:"nextFollowUpAt" form:"nextFollowUpAt"`

	TotalAmount12m     float64    `json:"totalAmount12m" form:"totalAmount12m"`         // 过去12个月累计消费金额
	OrderCount12m      int        `json:"orderCount12m" form:"orderCount12m"`           // 过去12个月订单数
	RepurchaseCount12m int        `json:"repurchaseCount12m" form:"repurchaseCount12m"` // 过去12个月回购次数
	AvgRepurchaseDays  int        `json:"avgRepurchaseDays" form:"avgRepurchaseDays"`   // 平均回购周期（天）
	LevelUpdatedAt     *time.Time `json:"levelUpdatedAt" form:"levelUpdatedAt"`         // 会员等级更新时间

	LifetimeOrderCount int     `json:"lifetimeOrderCount" form:"lifetimeOrderCount"` // 终身订单数
	LifetimeAmount     float64 `json:"lifetimeAmount" form:"lifetimeAmount"`         // 终身累计消费金额

	LastOrderAt *time.Time `json:"lastOrderAt" form:"lastOrderAt"`

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
