package number

import (
	"backend/internal/model"
	"errors"
	"fmt"
	"strings"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type NumberGenerator struct {
	db *gorm.DB
}

func NewNumberGenerator(db *gorm.DB) *NumberGenerator {
	return &NumberGenerator{db: db}
}

func (g *NumberGenerator) Generate(bizType string) (string, error) {
	date := time.Now().Format("20060102")
	var seq int

	err := g.db.Transaction(func(tx *gorm.DB) error {
		var record model.BizSequence

		err := tx.
			Clauses(clause.Locking{Strength: "UPDATE"}).
			Where("biz_type = ? AND seq_date = ?", bizType, date).
			First(&record).Error

		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				record = model.BizSequence{
					BizType:      bizType,
					SeqDate:      date,
					CurrentValue: 1,
				}

				if err := tx.Create(&record).Error; err != nil {
					// 处理并发插入冲突
					if strings.Contains(err.Error(), "Duplicate entry") {
						if err := tx.
							Clauses(clause.Locking{Strength: "UPDATE"}).
							Where("biz_type = ? AND seq_date = ?", bizType, date).
							First(&record).Error; err != nil {
							return err
						}

						record.CurrentValue++
						if err := tx.Save(&record).Error; err != nil {
							return err
						}

						seq = record.CurrentValue
						return nil
					}
					return err
				}

				seq = 1
				return nil
			}
			return err
		}

		record.CurrentValue++
		if err := tx.Save(&record).Error; err != nil {
			return err
		}

		seq = record.CurrentValue
		return nil
	})

	if err != nil {
		return "", err
	}

	return fmt.Sprintf("%s%s-%04d", bizType, date, seq), nil
}
