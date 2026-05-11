package service

import (
	"backend/internal/model"
	"backend/internal/repository"
	"errors"
)

func GetWarehouses() ([]model.Warehouse, error) {
	warehouses, err := repository.ListWarehouses()
	if err != nil {
		return nil, err
	}

	return warehouses, nil
}

func CreateWarehouse(wh *model.Warehouse) error {
	if wh.Name == "" {
		return errors.New("warehouse_name_is_required")
	}
	return repository.Create(wh)
}

func UpdateWarehouse(id uint, updated *model.Warehouse) error {
	_, err := repository.GetByID(id)
	if err != nil {
		return errors.New("warehouse_not_found")
	}
	existing, _ := repository.GetByID(id)
	existing.Name = updated.Name
	existing.Province = updated.Province
	existing.City = updated.City
	existing.District = updated.District
	existing.Address = updated.Address
	return repository.Update(existing)
}

func DeleteWarehouse(id uint) error {
	_, err := repository.GetByID(id)
	if err != nil {
		return errors.New("warehouse_not_found")
	}
	return repository.Delete(id)
}
