package model

import "time"

type Customer struct {
	ID        uint      `gorm:"primaryKey"`
	Name      string
	Phone     string
	Email     string
	Source    string  //(wechat, referral, ads)
	Level     string  //(vip, normal)
	Status    string  //(active, lost)
	OwnerID   uint

	CreatedAt time.Time
	UpdatedAt time.Time
}
