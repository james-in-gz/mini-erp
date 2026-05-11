package repository

import (
	"backend/internal/database"
	"backend/internal/model"
)

func ListWarehouses() ([]model.Warehouse, error) {
	var list []model.Warehouse
	err := database.DB.Find(&list).Error
	return list, err
}
