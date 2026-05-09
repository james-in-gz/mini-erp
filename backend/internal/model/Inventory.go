package model

import "time"

type Inventory struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	SKUID          uint      `gorm:"column:sku_id;uniqueIndex" json:"skuId"`
	Stock          int       `json:"stock"`
	LockedStock    int       `json:"lockedStock"`
	AvailableStock int       `json:"availableStock"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

// InventoryLog 库存日志
type InventoryLog struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	SKUID       uint      `gorm:"column:sku_id;index" json:"skuId"`
	Type        string    `json:"changeType"` // in, out, lock, unlock, adjust
	ChangeValue int       `json:"changeValue"`
	BeforeStock int       `json:"beforeStock"`
	AfterStock  int       `json:"afterStock"`
	RefType     string    `json:"refType,omitempty"` // ORDER / MANUAL
	RefID       uint      `json:"refID,omitempty"`
	Remark      string    `json:"remark"`
	CreatedBy   string    `json:"createdBy"`
	CreatedAt   time.Time `json:"createdAt"`
}

// 更新可用库存
func (i *Inventory) UpdateAvailableStock() {
	i.AvailableStock = i.Stock - i.LockedStock
}
