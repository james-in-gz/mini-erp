package service

import (
	"backend/internal/model"
	"backend/internal/repository"
)

type CreateProductReq struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock"`
}

func GetProducts() ([]*model.Product, error) {
	return repository.ListProducts()
}

func CreateProduct(req CreateProductReq) error {
	product := model.Product{
		Name:  req.Name,
		Price: req.Price,
		Stock: req.Stock,
	}

	return repository.CreateProduct(&product)
}
