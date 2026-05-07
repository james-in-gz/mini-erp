package service

import (
	"backend/internal/database"
	"backend/internal/dto"
	"backend/internal/model"
	"backend/internal/repository"
	"encoding/json"
	"strings"

	"gorm.io/gorm"
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
		Price:     req.Price,
	}

	err := repository.CreateSKU(&sku)
	if err != nil {
		return nil, err
	}
	return &sku, nil
}

func generateCombinations(
	specs []dto.SpecInput,
) []map[string]string {

	var result []map[string]string

	var dfs func(
		int,
		map[string]string,
	)

	dfs = func(
		index int,
		current map[string]string,
	) {

		if index == len(specs) {

			comb := make(map[string]string)

			for k, v := range current {
				comb[k] = v
			}

			result = append(result, comb)

			return
		}

		spec := specs[index]

		for _, val := range spec.Values {

			current[spec.Key] = val

			dfs(index+1, current)
		}
	}

	dfs(0, map[string]string{})

	return result
}

func generateSKUs(
	productID int,
	specs []dto.SpecInput,
) ([]model.SKU, error) {

	product, err := repository.GetProductByID(productID)
	if err != nil {
		return nil, err
	}

	combinations := generateCombinations(specs)

	var skus []model.SKU

	for _, comb := range combinations {

		specJSON, _ := json.Marshal(comb)

		var nameParts []string
		var codeParts []string

		for _, spec := range specs {

			val := comb[spec.Key]

			nameParts = append(nameParts, val)

			codeParts = append(
				codeParts,
				strings.ToUpper(val),
			)
		}

		name := strings.Join(nameParts, " ")

		code := product.SPU +
			"-" +
			strings.Join(codeParts, "-")

		sku := model.SKU{
			ProductID: product.ID,
			Code:      code,
			Specs:     string(specJSON),
			Name:      name,
			Price:     0,
		}

		skus = append(skus, sku)
	}

	return skus, nil
}

func CreateBatchSKUs(productID int, specs []dto.SpecInput) error {
	skus, err := generateSKUs(productID, specs)
	if err != nil {
		return err
	}

	return database.DB.Transaction(func(tx *gorm.DB) error {
		for i := range skus {
			if err := tx.Create(&skus[i]).Error; err != nil {
				return err
			}

			inv := model.Inventory{
				SKUID:          skus[i].ID,
				Stock:          0,
				LockedStock:    0,
				AvailableStock: 0,
			}

			if err := tx.Create(&inv).Error; err != nil {
				return err
			}
		}
		return nil
	})
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
