package repository

import (
	"backend/internal/database"
	"backend/internal/model"
	"errors"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// GetBySKUID 获取SKU库存
func GetBySKUID(skuID uint) (*model.Inventory, error) {
	var inv model.Inventory
	err := database.DB.Where("sku_id = ?", skuID).First(&inv).Error
	if err != nil {
		return nil, err
	}
	return &inv, nil
}

// BatchGetBySKUIDs 批量获取库存
func BatchGetBySKUIDs(skuIDs []uint) (map[uint]*model.Inventory, error) {
	var inventories []model.Inventory
	err := database.DB.Where("sku_id IN ?", skuIDs).Find(&inventories).Error
	if err != nil {
		return nil, err
	}

	result := make(map[uint]*model.Inventory)
	for i := range inventories {
		result[inventories[i].SKUID] = &inventories[i]
	}
	return result, nil
}

// DeductStock 扣减库存（原子操作）
func DeductStock(skuID uint, quantity int, orderID uint, remark string) error {
	return database.DB.Transaction(func(tx *gorm.DB) error {
		var inv model.Inventory

		// 行锁
		if database.DB.Dialector.Name() != "sqlite" {
			tx = tx.Clauses(clause.Locking{Strength: "UPDATE"})
		}
		if err := tx.Where("sku_id = ?", skuID).First(&inv).Error; err != nil {
			return err
		}

		// 检查可用库存
		if inv.AvailableStock < quantity {
			return errors.New("库存不足")
		}

		// 记录变更前的值
		beforeStock := inv.AvailableStock

		// 更新库存
		inv.LockedStock += quantity
		inv.UpdateAvailableStock()

		if err := tx.Save(&inv).Error; err != nil {
			return err
		}

		// 记录日志
		log := model.InventoryLog{
			SKUID:       skuID,
			Type:        "lock",
			ChangeValue: quantity,
			BeforeStock: beforeStock,
			AfterStock:  inv.AvailableStock,
			RefID:       orderID,
			RefType:     "order",
			Remark:      remark,
		}

		return tx.Create(&log).Error
	})
}

// ConfirmDeduct 确认扣减（支付后）
func ConfirmDeduct(skuID uint, quantity int, orderID uint) error {
	return database.DB.Transaction(func(tx *gorm.DB) error {
		var inv model.Inventory

		// 行锁
		if database.DB.Dialector.Name() != "sqlite" {
			tx = tx.Clauses(clause.Locking{Strength: "UPDATE"})
		}
		if err := tx.Where("sku_id = ?", skuID).First(&inv).Error; err != nil {
			return err
		}

		beforeStock := inv.Stock
		inv.Stock -= quantity
		inv.LockedStock -= quantity
		inv.UpdateAvailableStock()

		if err := tx.Save(&inv).Error; err != nil {
			return err
		}

		log := model.InventoryLog{
			SKUID:       skuID,
			Type:        "out",
			ChangeValue: -quantity,
			BeforeStock: beforeStock,
			AfterStock:  inv.Stock,
			RefID:       orderID,
			RefType:     "order",
		}

		return tx.Create(&log).Error
	})
}

// ReleaseLock 释放锁定（取消订单）
func ReleaseLock(skuID uint, quantity int, orderID uint) error {
	return database.DB.Transaction(func(tx *gorm.DB) error {
		var inv model.Inventory

		// 行锁
		if database.DB.Dialector.Name() != "sqlite" {
			tx = tx.Clauses(clause.Locking{Strength: "UPDATE"})
		}
		if err := tx.Where("sku_id = ?", skuID).First(&inv).Error; err != nil {
			return err
		}

		beforeStock := inv.AvailableStock
		inv.LockedStock -= quantity
		inv.UpdateAvailableStock()

		if err := tx.Save(&inv).Error; err != nil {
			return err
		}

		log := model.InventoryLog{
			SKUID:       skuID,
			Type:        "unlock",
			ChangeValue: -quantity,
			BeforeStock: beforeStock,
			AfterStock:  inv.AvailableStock,
			RefID:       orderID,
			RefType:     "order",
		}

		return tx.Create(&log).Error
	})
}

// AdjustStock 管理员调整库存
func AdjustStock(skuID uint, quantity int, remark, operator string) error {
	return database.DB.Transaction(func(tx *gorm.DB) error {
		var inv model.Inventory

		err := tx.Where("sku_id = ?", skuID).First(&inv).Error
		if err != nil {
			// 不存在则创建
			inv = model.Inventory{SKUID: skuID, Stock: 0, LockedStock: 0}
			inv.UpdateAvailableStock()
			if err := tx.Create(&inv).Error; err != nil {
				return err
			}
		}

		beforeStock := inv.Stock
		inv.Stock += quantity
		inv.UpdateAvailableStock()

		if err := tx.Save(&inv).Error; err != nil {
			return err
		}

		log := model.InventoryLog{
			SKUID:       skuID,
			Type:        "adjust",
			ChangeValue: quantity,
			BeforeStock: beforeStock,
			AfterStock:  inv.Stock,
			RefType:     "manual",
			Remark:      remark,
			CreatedBy:   operator,
		}

		return tx.Create(&log).Error
	})
}

// GetLogs 获取库存日志
func GetLogs(skuID uint, page, pageSize int) ([]model.InventoryLog, int64, error) {
	var logs []model.InventoryLog
	var total int64

	query := database.DB.Model(&model.InventoryLog{}).Where("sku_id = ?", skuID)
	query.Count(&total)

	err := query.Order("created_at DESC").Offset((page - 1) * pageSize).Limit(pageSize).Find(&logs).Error

	return logs, total, err
}

func AddStock(skuID uint, quantity int, operator string) error {
	return database.DB.Transaction(func(tx *gorm.DB) error {
		var inv model.Inventory

		err := tx.Where("sku_id = ?", skuID).First(&inv).Error
		if err != nil {
			// 不存在则创建
			return err
		}

		beforeStock := inv.Stock
		inv.Stock += quantity
		inv.UpdateAvailableStock()

		if err := tx.Save(&inv).Error; err != nil {
			return err
		}

		log := model.InventoryLog{
			SKUID:       skuID,
			Type:        "in",
			ChangeValue: quantity,
			BeforeStock: beforeStock,
			AfterStock:  inv.Stock,
			RefType:     "manual",
			Remark:      "入库",
			CreatedBy:   operator,
		}

		return tx.Create(&log).Error
	})
}
