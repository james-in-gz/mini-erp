package repository

import (
	"backend/internal/database"
	"backend/internal/dto"
	"backend/internal/model"
)

func GetPipelineStats() ([]dto.PipelineItem, error) {
	var result []dto.PipelineItem

	err := database.DB.Model(&model.Customer{}).
		Select("status, count(*) as count").
		Group("status").
		Scan(&result).Error

	return result, err
}

func GetSourceStats() ([]dto.SourceStat, error) {
	var result []dto.SourceStat

	err := database.DB.Model(&model.Customer{}).
		Select("source, count(*) as count").
		Group("source").
		Scan(&result).Error

	return result, err
}

func GetOwnerStats() ([]dto.OwnerStat, error) {
	var result []dto.OwnerStat

	err := database.DB.Table("customers c").
		Select("u.username, count(*) as count").
		Joins("left join users u on u.id = c.owner_id").
		Group("u.name").
		Scan(&result).Error

	return result, err
}
