package main

import (
	"backend/internal/database"
	"backend/internal/handler"
	"backend/internal/handler/auth"
	"backend/internal/handler/customer"
	"backend/internal/handler/inventory"
	"backend/internal/handler/order"
	"backend/internal/handler/product"
	"backend/internal/handler/user"
	"backend/internal/middleware"
	"os"

	"backend/internal/jobs"

	"github.com/gin-gonic/gin"

	"github.com/robfig/cron/v3"
)

func main() {

	database.InitDB()

	if os.Getenv("ENV") == "init" {
		database.AutoMigrate()
		database.Seed()
	}

	r := gin.Default()

	c := cron.New()

	// 每天凌晨2点
	c.AddFunc("0 2 * * *", func() {

		jobs.RefreshAllCustomerLevels(database.DB)
	})

	c.Start()

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
		authGroup.PUT("/orders/:id/address", order.UpdateOrderAddress)
		authGroup.POST("/orders/:id/cancel", order.CancelOrder)
		authGroup.POST("/orders/:id/shipping", order.AddShipping)
		authGroup.POST("/orders/:id/shipments", order.CreateShipment)
		authGroup.GET("/orders/:id/shipments", order.ListShipments)
		authGroup.POST("/orders/:id/payments", order.CreatePayment)
		authGroup.PUT("/orders/:id/next-delivery-time", order.UpdateNextDeliveryTime)
		authGroup.GET("/products", product.GetProducts)
		authGroup.POST("/products", product.CreateProduct)
		authGroup.GET("/products/:id", product.GetProductDetail)
		authGroup.POST("/products/:id/skus/generate", product.GenerateSKUs)
		authGroup.GET("/products/:id/skus", product.GetSKUs)
		authGroup.GET("/skus/:id", product.GetSKUDetail)
		authGroup.PUT("/skus/:id", product.UpdateSKU)
		authGroup.GET("/skus", product.GetAllSKUs)
		authGroup.DELETE("/skus/:id", product.DeleteSKU)
		authGroup.GET("/customers/:id/addresses", handler.GetAddresses)
		authGroup.POST("/customers/:id/addresses", handler.CreateAddress)
		authGroup.POST("/addresses/:id/default", handler.SetDefault)
		authGroup.GET("/customers/search", customer.SearchCustomers)

		inventoryGroup := authGroup.Group("/inventory")
		{
			// 查询
			inventoryGroup.GET("/:skuId", inventory.HandleGetBySKU)
			inventoryGroup.POST("/batch", inventory.HandleBatchGet)
			inventoryGroup.POST("/batch-check", inventory.HandleBatchCheck)

			// 管理
			inventoryGroup.POST("/adjust", inventory.HandleAdjust)
			inventoryGroup.GET("/logs/:skuId", inventory.HandleGetLogs)
		}

	}

	r.Run(":8080")
}
