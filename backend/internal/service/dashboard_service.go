package service

import (
	"backend/internal/repository"
	"time"
)

type DashboardData struct {
	Today   int64 `json:"today"`
	Done    int64 `json:"done"`
	Overdue int64 `json:"overdue"`
}

func GetDashboard() (*DashboardData, error) {
	now := time.Now()

	start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	end := time.Date(now.Year(), now.Month(), now.Day(), 23, 59, 59, 0, now.Location())

	today, err := repository.CountTodayFollowUps(start, end)
	if err != nil {
		return nil, err
	}

	overdue, err := repository.CountOverdue(now)
	if err != nil {
		return nil, err
	}

	done, err := repository.CountDone(end)
	if err != nil {
		return nil, err
	}

	return &DashboardData{
		Today:   today,
		Done:    done,
		Overdue: overdue,
	}, nil
}
