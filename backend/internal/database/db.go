package database

import (
	"log"
	"os"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
)

var DB *gorm.DB

func InitDB() {
	dsn := "root:password@tcp(127.0.0.1:3306)/oms_crm?charset=utf8mb4&parseTime=True&loc=Local"

	// 日志模式（开发环境详细，生产简洁）
	var logMode logger.LogLevel
	if os.Getenv("ENV") == "dev" {
		logMode = logger.Info
	} else {
		logMode = logger.Warn
	}

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
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
