package service

import (
	"backend/internal/dto"
	"backend/internal/model"
	"backend/internal/repository"
)

func GetProducts() ([]*model.Product, error) {
	return repository.ListProducts()
}

func CreateProduct(req dto.CreateProductReq) error {
	product := model.Product{
		Name: req.Name,
		SPU:  req.SPU,
	}

	return repository.CreateProduct(&product)
}

func GetProductByID(id int) (*model.Product, error) {
	return repository.GetProductByID(id)
}

func UpdateProduct(id int, req dto.CreateProductReq) error {
	product, err := repository.GetProductByID(id) // TODO: handle error
	if err != nil {
		return err
	}

	product.Name = req.Name
	product.SPU = req.SPU

	return repository.UpdateProduct(product)
}

func DeleteProduct(id int) error {
	return repository.DeleteProduct(id)
}

func GetSKUsByProductID(productID int) ([]*model.SKU, error) {
	return repository.ListSKUsByProductID(productID)
}

func CreateSKU(productID uint, req dto.CreateSKUReq) (*model.SKU, error) {
	sku := model.SKU{
		ProductID: productID,
		Name:      req.Name,
		Category:  req.Category,
		Factory:   req.Factory,
		Craft:     req.Craft,
		Spec:      req.Spec,
		Unit:      req.Unit,
		Price:     req.Price,
	}

	err := repository.CreateSKU(&sku)
	if err != nil {
		return nil, err
	}
	return &sku, nil
}

func GetSKUByID(id int) (*model.SKU, error) {
	return repository.GetSKUByID(id)
}

func UpdateSKU(id int, req dto.CreateSKUReq) error {
	sku, err := repository.GetSKUByID(id) // TODO: handle error
	if err != nil {
		return err
	}

	sku.Name = req.Name
	sku.Category = req.Category
	sku.Factory = req.Factory
	sku.Craft = req.Craft
	sku.Spec = req.Spec
	sku.Unit = req.Unit
	sku.Price = req.Price

	return repository.UpdateSKU(sku)
}

func DeleteSKU(id int) error {
	return repository.DeleteSKU(id)
}

func listSKUs() ([]*model.SKU, error) {
	return repository.ListSKUs()
}

func listSKUsByProductID(productID int) ([]*model.SKU, error) {
	return repository.ListSKUsByProductID(productID)
}
