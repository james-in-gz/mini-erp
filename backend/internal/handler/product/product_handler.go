package product

import (
	"backend/internal/dto"
	"backend/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetProducts(c *gin.Context) {
	products, err := service.GetProducts()
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}
	dto.Success(c, products)
}

func GetProductDetail(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		dto.Fail(c, "invalid product id")
		return
	}

	product, err := service.GetProductByID(id)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, product)
}

func CreateProduct(c *gin.Context) {
	var req dto.CreateProductReq

	if err := c.ShouldBindJSON(&req); err != nil {
		dto.Fail(c, err.Error())
		return
	}

	err := service.CreateProduct(req)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, gin.H{"message": "ok"})
}

func GetSKUs(c *gin.Context) {
	productID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		dto.Fail(c, "Invalid product ID")
		return
	}

	result, err := service.GetSKUsByProductID(productID)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, result)
}

func GenerateSKUs(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	var req dto.GenerateSKURequest

	if err := c.ShouldBindJSON(&req); err != nil {
		dto.Fail(c, err.Error())
		return
	}

	if err := service.CreateBatchSKUs(id, req.Specs); err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, gin.H{"message": "ok"})
}

func GetSKUDetail(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		dto.Fail(c, "Invalid SKU ID")
		return
	}

	result, err := service.GetSKUByID(id)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, result)
}

func UpdateSKU(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		dto.Fail(c, "Invalid SKU ID")
		return
	}

	var req dto.UpdateSKUReq

	if err := c.ShouldBindJSON(&req); err != nil {
		dto.Fail(c, err.Error())
		return
	}

	result, err := service.UpdateSKU(id, req)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, result)
}
