package main

import (
	"github.com/gin-gonic/gin"
	"backend/internal/middleware"
	"backend/internal/handler/auth"
	"backend/internal/handler/customer"
	"backend/internal/database"
)

func main() {
	
	database.InitDB()
	
	r := gin.Default()

	// Public routes
	r.POST("/api/login", auth.LoginHandler)

	// Protected routes
	authGroup := r.Group("/api")
	authGroup.Use(middleware.JWTAuth())
	{
		authGroup.POST("/users",middleware.AdminOnly(),user.CreateUser)
		authGroup.GET("/me", auth.MeHandler)
		authGroup.POST("/customers", customer.CreateCustomer)
		authGroup.GET("/customers", customer.ListCustomers)
	}

	r.Run(":8080")
}
