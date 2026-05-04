package model

type CustomerAddress struct {
	ID         uint `gorm:"primaryKey" json:"id,omitempty"`
	CustomerID uint `gorm:"index" json:"customerID,omitempty"`

	Name  string `json:"name,omitempty"`
	Phone string `json:"phone,omitempty"`

	Province string `gorm:"size:50" json:"province,omitempty"` // 省
	City     string `gorm:"size:50" json:"city,omitempty"`     // 市
	District string `gorm:"size:50" json:"district,omitempty"` // 区

	Address string `json:"address,omitempty"` // 详细地址

	IsDefault bool `gorm:"default:false" json:"isDefault,omitempty"`
}
