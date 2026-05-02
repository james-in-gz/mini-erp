package main

import "backend/internal/database"

func main() {
	database.InitDB()
	database.AutoMigrate()
	database.Seed()
}
