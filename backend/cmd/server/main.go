package main

import (
	"backend/internal/database"
	"backend/internal/handler"
	"backend/internal/handler/auth"
	"backend/internal/handler/customer"
	"backend/internal/handler/order"
	"backend/internal/handler/product"
	"backend/internal/handler/user"
	"backend/internal/middleware"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {

	database.InitDB()

	if os.Getenv("ENV") == "init" {
		database.AutoMigrate()
		database.Seed()
	}

	r := gin.Default()

	// Public routes
	r.POST("/api/login", auth.LoginHandler)

	// Protected routes
	authGroup := r.Group("/api")
	authGroup.Use(middleware.JWTAuth())
	{
		authGroup.POST("/users", middleware.AdminOnly(), user.CreateUser)
		authGroup.GET("/me", auth.MeHandler)
		authGroup.POST("/customers", customer.CreateCustomer)
		authGroup.PUT("/customers/:id/status", customer.UpdateCustomerStatus)
		authGroup.GET("/customers", customer.ListCustomers)
		authGroup.POST("/customers/:id/notes", customer.CreateCustomerNote)
		authGroup.GET("/customers/:id/notes", customer.ListCustomerNotes)
		authGroup.GET("/customers/follow-ups", customer.GetFollowUps)
		authGroup.GET("/customers/:id", customer.GetCustomerDetail)
		authGroup.PUT("/customers/:id", customer.UpdateCustomerBaseInfo)
		authGroup.GET("/dashboard", handler.GetDashboard)
		authGroup.POST("/orders", order.CreateOrder)
		authGroup.GET("/orders", order.GetOrders)
		authGroup.GET("/orders/:id", order.GetOrderByID)
		authGroup.POST("/orders/:id/shipping", order.AddShipping)
		authGroup.POST("/orders/:id/shipments", order.CreateShipment)
		authGroup.GET("/orders/:id/shipments", order.ListShipments)
		authGroup.GET("/products", product.GetProducts)
		authGroup.POST("/products", product.CreateProduct)
		authGroup.GET("/products/:id", product.GetProductDetail)
		authGroup.POST("/products/:id/skus", product.CreateSKU)
		authGroup.POST("/products/:id/skus/generate", product.GenerateSKUs)
		authGroup.GET("/products/:id/skus", product.GetSKUs)
		authGroup.GET("/customers/:id/addresses", handler.GetAddresses)
		authGroup.POST("/customers/:id/addresses", handler.CreateAddress)
		authGroup.POST("/addresses/:id/default", handler.SetDefault)
		authGroup.GET("/customers/search", customer.SearchCustomers)

	}

	r.Run(":8080")
}
