package main

import (
	"backend/internal/database"
	"backend/internal/handler"
	"backend/internal/handler/auth"
	"backend/internal/handler/customer"
	"backend/internal/handler/user"
	"backend/internal/middleware"

	"github.com/gin-gonic/gin"
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
		authGroup.POST("/users", middleware.AdminOnly(), user.CreateUser)
		authGroup.GET("/me", auth.MeHandler)
		authGroup.POST("/customers", customer.CreateCustomer)
		authGroup.GET("/customers", customer.ListCustomers)
		authGroup.POST("/customers/:id/notes", customer.CreateCustomerNote)
		authGroup.GET("/customers/:id/notes", customer.ListCustomerNotes)
		authGroup.GET("/customers/follow-ups/today", customer.ListTodayFollowUps)
		authGroup.GET("/customers/:id", customer.GetCustomerDetail)
		authGroup.GET("/dashboard", handler.GetDashboard)
	}

	r.Run(":8080")
}
