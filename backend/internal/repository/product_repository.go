package repository

import (
	"backend/internal/database"
	"backend/internal/model"
)

func CreateProduct(product *model.Product) error {
	return database.DB.Create(product).Error
}

func GetProductByID(id int) (*model.Product, error) {
	var product model.Product
	err := database.DB.First(&product, id).Error
	return &product, err
}

func UpdateProduct(product *model.Product) error {
	return database.DB.Save(product).Error
}

func DeleteProduct(id int) error {
	return database.DB.Delete(&model.Product{}, id).Error
}

func ListProducts() ([]*model.Product, error) {
	var products []*model.Product
	err := database.DB.Find(&products).Error
	return products, err
}

func ListSKUsByProductID(productID int) ([]*model.SKU, error) {
	var skus []*model.SKU
	err := database.DB.Where("product_id = ?", productID).Find(&skus).Error
	return skus, err
}

func CreateSKU(sku *model.SKU) error {
	return database.DB.Create(sku).Error
}

func GetSKUByID(id int) (*model.SKU, error) {
	var sku model.SKU
	err := database.DB.First(&sku, id).Error
	return &sku, err
}

func UpdateSKU(sku *model.SKU) error {
	return database.DB.Save(sku).Error
}

func DeleteSKU(id int) error {
	return database.DB.Delete(&model.SKU{}, id).Error
}

func ListSKUs() ([]*model.SKU, error) {
	var skus []*model.SKU
	err := database.DB.Find(&skus).Error
	return skus, err
}
