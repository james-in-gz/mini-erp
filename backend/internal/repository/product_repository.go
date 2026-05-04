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
