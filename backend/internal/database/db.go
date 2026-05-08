package database

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
)

var DB *gorm.DB

func InitDB() {
	//dsn := "ypyy:你的密码@tcp(172.18.0.2:3306)/ypyy?charset=utf8mb4&parseTime=True&loc=Local&tls=skip"

	var dialector gorm.Dialector

	// 日志模式（开发环境详细，生产简洁）
	var logMode logger.LogLevel
	if os.Getenv("ENV") == "dev" {
		logMode = logger.Info
		dialector = sqlite.Open("test.db")

	} else {
		dsn := fmt.Sprintf(
			"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Asia/ShangHai",
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			os.Getenv("DB_HOST"),
			os.Getenv("DB_PORT"),
			os.Getenv("DB_NAME"),
		)
		dialector = mysql.Open(dsn)

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
