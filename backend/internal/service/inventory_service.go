package service

import (
	"backend/internal/model"
	"backend/internal/repository"
)

// BatchCheckRequest 批量检查请求
type BatchCheckRequest struct {
	Items []struct {
		SKUID    uint `json:"skuId"`
		Quantity int  `json:"quantity"`
	} `json:"items"`
}

// BatchCheckResponse 批量检查响应
type BatchCheckResponse struct {
	AllAvailable bool                       `json:"allAvailable"`
	Items        map[uint]BatchCheckItemRes `json:"items"`
}

// BatchCheckItemRes 单个检查结果
type BatchCheckItemRes struct {
	Available bool   `json:"available"`
	Stock     int    `json:"stock"`
	Message   string `json:"message,omitempty"`
}

// BatchCheckStock 批量检查库存
func BatchCheckStock(req *BatchCheckRequest) (*BatchCheckResponse, error) {
	// 收集所有 SKU ID
	skuIDs := make([]uint, 0)
	for _, item := range req.Items {
		skuIDs = append(skuIDs, item.SKUID)
	}

	// 批量获取库存
	inventories, err := repository.BatchGetBySKUIDs(skuIDs)
	if err != nil {
		return nil, err
	}

	res := &BatchCheckResponse{
		AllAvailable: true,
		Items:        make(map[uint]BatchCheckItemRes),
	}

	for _, item := range req.Items {
		inv, exists := inventories[item.SKUID]
		if !exists {
			res.AllAvailable = false
			res.Items[item.SKUID] = BatchCheckItemRes{
				Available: false,
				Stock:     0,
				Message:   "SKU不存在或无库存记录",
			}
			continue
		}

		available := inv.AvailableStock >= item.Quantity
		if !available {
			res.AllAvailable = false
		}

		message := ""
		if !available {
			message = "库存不足"
		}

		res.Items[item.SKUID] = BatchCheckItemRes{
			Available: available,
			Stock:     inv.AvailableStock,
			Message:   message,
		}
	}

	return res, nil
}

func GetBySKUID(skuID uint) (*model.Inventory, error) {
	return repository.GetBySKUID(skuID)
}

func BatchGetBySKUIDs(skuIDs []uint) (map[uint]*model.Inventory, error) {
	return repository.BatchGetBySKUIDs(skuIDs)
}

func AdjustStock(skuID uint, quantity int, remark string, operatorId uint) error {
	operator, err := repository.GetUserById(operatorId)
	if err != nil {
		return err
	}
	return repository.AdjustStock(skuID, quantity, remark, operator.Username)
}

func GetLogs(skuID uint, page int, pageSize int) ([]model.InventoryLog, int64, error) {
	return repository.GetLogs(skuID, page, pageSize)
}

func AddStock(skuID uint, quantity int, remark string, operatorId uint) error {
	operator, err := repository.GetUserById(operatorId)
	if err != nil {
		return err
	}
	return repository.AddStock(skuID, quantity, operator.Username)
}

func ReduceStock(skuID uint, quantity int, operatorId uint) error {
	operator, err := repository.GetUserById(operatorId)
	if err != nil {
		return err
	}
	return repository.AddStock(skuID, quantity*-1, operator.Username)
}
