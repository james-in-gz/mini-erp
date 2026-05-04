package database

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
)

var DB *gorm.DB

func InitDB() {
	// dsn := "root:password@tcp(127.0.0.1:3306)/oms_crm?charset=utf8mb4&parseTime=True&loc=Local"

	var dialector gorm.Dialector

	// 日志模式（开发环境详细，生产简洁）
	var logMode logger.LogLevel
	if os.Getenv("ENV") == "dev" {
		logMode = logger.Info
		dialector = sqlite.Open("test.db")

	} else {
		user := os.Getenv("DB_USER")
		password := os.Getenv("DB_PASSWORD")
		host := os.Getenv("DB_HOST")
		dbname := os.Getenv("DB_NAME")
		port := os.Getenv("DB_PORT")

		dsn := fmt.Sprintf(
			"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai",
			host, user, password, dbname, port,
		)
		dialector = postgres.Open(dsn)

		logMode = logger.Warn
	}

	db, err := gorm.Open(dialector, &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			SingularTable: false, // 强制复数表名
		},
		Logger: logger.Default.LogMode(logMode),
	})

	if err != nil {
		log.Fatal("❌ failed to connect database:", err)
	}

	// 获取底层 sql.DB
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("❌ failed to get sql.DB:", err)
	}

	// 连接池配置（非常重要）
	sqlDB.SetMaxOpenConns(20)           // 最大连接数
	sqlDB.SetMaxIdleConns(10)           // 空闲连接数
	sqlDB.SetConnMaxLifetime(time.Hour) // 连接最大存活时间

	DB = db

	log.Println("✅ Database connected")
}
