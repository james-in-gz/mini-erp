package main

import (
	"github.com/gin-gonic/gin"
	"github.com/ximing/mini-erp/internal/middleware"
	"github.com/ximing/mini-erp/internal/handler/auth"
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
		authGroup.GET("/me", auth.MeHandler)
	}

	r.Run(":8080")
}
