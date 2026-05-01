package model

type Tag struct {
	ID    uint   `gorm:"primaryKey"`
	Name  string `gorm:"uniqueIndex"`
	Color string
}

type CustomerTag struct {
	CustomerID uint `gorm:"primaryKey"`
	TagID      uint `gorm:"primaryKey"`
}
