package jobs

import (
	"backend/internal/model"
	"backend/internal/service"

	"gorm.io/gorm"
)

func RefreshAllCustomerLevels(db *gorm.DB) {

	var customers []model.Customer

	db.Find(&customers)

	levelService := service.CustomerLevelService{
		DB: db,
	}

	for _, customer := range customers {

		_ = levelService.RefreshCustomerLevel(customer.ID)
	}
}
