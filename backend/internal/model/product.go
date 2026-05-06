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
	ProductID uint `gorm:"index" json:"productId,omitempty"`

	Code     string `gorm:"size:100;uniqueIndex" json:"code,omitempty"` // ⭐ SKU编码
	Name     string `json:"name,omitempty"`                             // 如：500g装 / 红色 / 套餐A
	Category string `json:"category,omitempty"`                         // 如：规格 / 颜色 / 套餐
	Factory  string `json:"factory,omitempty"`                          // 生产厂家
	Craft    string `json:"craft,omitempty"`                            // 工艺要求
	Spec     string `json:"spec,omitempty"`                             // 规格型号
	Unit     string `json:"unit,omitempty"`                             // 单位，如：瓶 / 盒 / 袋

	Price float64 `json:"price,omitempty"`

	CreatedAt time.Time `json:"createdAt,omitempty"`
	UpdatedAt time.Time `json:"updatedAt,omitempty"`
}

type Inventory struct {
	ID    uint `gorm:"primaryKey"`
	SKUID uint `gorm:"uniqueIndex"`

	Stock int // 当前库存

	CreatedAt time.Time `json:"createdAt,omitempty"`
	UpdatedAt time.Time `json:"updatedAt,omitempty"`
}

type StockLog struct {
	ID    uint `gorm:"primaryKey"`
	SKUID uint

	Type string // IN / OUT
	Qty  int

	RefType string // ORDER / MANUAL
	RefID   uint

	CreatedAt time.Time
}
