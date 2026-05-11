package model

type Warehouse struct {
	ID uint `gorm:"primaryKey" json:"id,omitempty"`

	Name string `json:"name,omitempty"`

	ContactName string `json:"contactName,omitempty"`

	Phone string `json:"phone,omitempty"`

	Province string `json:"province,omitempty"`
	City     string `json:"city,omitempty"`
	District string `json:"district,omitempty"`
	Address  string `json:"address,omitempty"`
}
