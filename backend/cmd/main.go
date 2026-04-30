package main

import (
	"backend/internal/config"
	"backend/internal/middleware"
	"backend/internal/modules/auth"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Public routes
	r.POST("/login", auth.LoginHandler)

	// Protected routes
	authGroup := r.Group("/api")
	authGroup.Use(middleware.JWTAuth())
	{
		authGroup.GET("/me", auth.MeHandler)
	}

	r.Run(":8080")
}
