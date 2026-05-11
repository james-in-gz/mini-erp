package service

import (
	"backend/internal/model"
	"backend/internal/repository"
)

func GetWarehouses() ([]model.Warehouse, error) {
	warehouses, err := repository.ListWarehouses()
	if err != nil {
		return nil, err
	}

	return warehouses, nil
}
