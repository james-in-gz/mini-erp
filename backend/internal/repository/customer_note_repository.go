package repository

import (
	"backend/internal/database"
	"backend/internal/model"
)

func CreateCustomerNote(note *model.CustomerNote) error {
	return database.DB.Create(note).Error
}

func ListCustomerNotes(customerID uint) ([]model.CustomerNote, error) {
	var notes []model.CustomerNote

	err := database.DB.
		Where("customer_id = ?", customerID).
		Order("created_at DESC").
		Find(&notes).Error

	return notes, err
}

func ListCustomerNotes(customerID uint) ([]model.CustomerNote, error) {
	var notes []model.CustomerNote

	err := database.DB.
		Where("customer_id = ?", customerID).
		Order("created_at DESC").
		Find(&notes).Error

	return notes, err
}

func GetLatestCustomerNote(customerID uint) (*model.CustomerNote, error) {
	var note model.CustomerNote

	err := database.DB.
		Where("customer_id = ?", customerID).
		Order("created_at DESC").
		First(&note).Error

	if err != nil {
		return nil, err
	}

	return &note, nil
}
