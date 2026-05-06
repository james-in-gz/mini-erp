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

func CreateSKU(c *gin.Context) {
	var req dto.CreateSKUReq

	if err := c.ShouldBindJSON(&req); err != nil {
		dto.Fail(c, err.Error())
		return
	}

	productID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		dto.Fail(c, "Invalid product ID")
		return
	}

	sku, err := service.CreateSKU(uint(productID), req)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, sku)
}
