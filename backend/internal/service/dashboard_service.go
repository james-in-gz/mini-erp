package service

import (
	"backend/internal/dto"
	"backend/internal/repository"
)

func GetDashboard(ownerID uint) (dto.DashboardResponse, error) {
	var res dto.DashboardResponse

	// 1️⃣ Follow-up（你已有）
	fu, _ := GetFollowUps(ownerID)
	res.Today.Overdue = len(fu.Overdue)
	res.Today.Today = len(fu.Today)
	res.Today.Upcoming = len(fu.Upcoming)

	// 2️⃣ Pipeline
	pipeline, _ := repository.GetPipelineStats()
	for _, p := range pipeline {
		res.Pipeline = append(res.Pipeline, dto.PipelineItem{
			Status: p.Status,
			Count:  p.Count,
		})
	}

	// 3️⃣ Source
	sources, _ := repository.GetSourceStats()
	for _, s := range sources {
		res.Sources = append(res.Sources, dto.SourceStat{
			Source: s.Source,
			Count:  s.Count,
		})
	}

	// 4️⃣ Owner
	owners, _ := repository.GetOwnerStats()
	for _, o := range owners {
		res.Owners = append(res.Owners, dto.OwnerStat{
			Name:    o.Name,
			Count:   o.Count,
			Revenue: o.Revenue,
		})
	}

	return res, nil
}
