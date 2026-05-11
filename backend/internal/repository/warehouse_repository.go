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

func Create(wh *model.Warehouse) error {
	return database.DB.Create(wh).Error
}

func GetByID(id uint) (*model.Warehouse, error) {
	var wh model.Warehouse
	err := database.DB.First(&wh, id).Error
	return &wh, err
}

func Update(wh *model.Warehouse) error {
	return database.DB.Save(wh).Error
}

func Delete(id uint) error {
	return database.DB.Delete(&model.Warehouse{}, id).Error
}
