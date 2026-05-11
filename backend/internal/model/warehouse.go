package model

type Warehouse struct {
	ID uint `gorm:"primaryKey" json:"id,omitempty"`

	Name string

	ContactName string

	Phone string

	Province string
	City     string
	District string
	Address  string
}
