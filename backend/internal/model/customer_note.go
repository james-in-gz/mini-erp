package model

type CustomerNote struct {
	ID              uint      `gorm:"primaryKey"`
	CustomerID      uint      `gorm:"index"`
	UserID          uint
	Content         string    `gorm:"type:text"`
	NextFollowUpAt  *time.Time

	CreatedAt       time.Time
}
