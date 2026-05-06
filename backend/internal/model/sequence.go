package model

type BizSequence struct {
	ID           int64  `gorm:"primaryKey"`
	BizType      string `gorm:"size:20;not null;index:idx_biz_date,unique"`
	SeqDate      string `gorm:"size:8;not null;index:idx_biz_date,unique"`
	CurrentValue int
}
