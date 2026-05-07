package model

import "time"

type Product struct {
	ID        uint      `gorm:"primaryKey" json:"id,omitempty"`
	Name      string    `gorm:"size:255" json:"name,omitempty"`
	SPU       string    `gorm:"size:100;uniqueIndex" json:"spu,omitempty"` // ⭐ SPU编码
	CreatedAt time.Time `json:"createdAt,omitempty"`
	UpdatedAt time.Time `json:"updatedAt,omitempty"`
}

type SKU struct {
	ID        uint `gorm:"primaryKey" json:"id,omitempty"`
	ProductID uint `gorm:"index" json:"productID,omitempty"`

	Code string `gorm:"size:100;uniqueIndex" json:"code,omitempty"` // SKU编码

	// ⭐ 核心：可扩展规格
	Specs string `gorm:"type:json" json:"specs,omitempty"` // {"weight":"500g","color":"red"}

	Name   string `json:"name,omitempty"`   // 展示用（自动生成）
	Unit   string `json:"unit,omitempty"`   // 单位	计量单位，如：件、盒、瓶
	Weight int64  `json:"weight,omitempty"` // 重量，单位克 计算运费

	Price     float64 `json:"price,omitempty"`
	CostPrice float64 `json:"costPrice,omitempty"`

	Status int `json:"status,omitempty"` // active / inactive

	CreatedAt time.Time `json:"createdAt,omitempty"`
	UpdatedAt time.Time `json:"updatedAt,omitempty"`
}

type Inventory struct {
	ID    uint `gorm:"primaryKey" json:"id,omitempty"`
	SKUID uint `gorm:"index" json:"skuid,omitempty"`

	Stock          int `json:"stock,omitempty"`
	LockedStock    int `json:"lockedStock,omitempty"`
	AvailableStock int `json:"availableStock,omitempty"`

	UpdatedAt time.Time `json:"updatedAt,omitempty"`
}

type StockLog struct {
	ID    uint `gorm:"primaryKey" json:"id,omitempty"`
	SKUID uint `json:"skuid,omitempty"`

	Type string `json:"type,omitempty"` // IN / OUT
	Qty  int    `json:"qty,omitempty"`

	RefType string `json:"refType,omitempty"` // ORDER / MANUAL
	RefID   uint   `json:"refID,omitempty"`

	CreatedAt time.Time `json:"createdAt,omitempty"`
}
