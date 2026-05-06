package product

import (
	"backend/internal/dto"
	"backend/internal/service"

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
	var req service.CreateProductReq

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
