package dto

type DashboardResponse struct {
	Today struct {
		Overdue  int `json:"overdue"`
		Today    int `json:"today"`
		Upcoming int `json:"upcoming"`
	} `json:"today"`

	Pipeline []PipelineItem `json:"pipeline"`

	Sources []SourceStat `json:"sources"`

	Owners []OwnerStat `json:"owners"`
}

type PipelineItem struct {
	Status string `json:"status,omitempty"`
	Count  int    `json:"count,omitempty"`
}

type SourceStat struct {
	Source string `json:"source,omitempty"`
	Count  int    `json:"count,omitempty"`
}

type OwnerStat struct {
	Name    string  `json:"name,omitempty"`
	Count   int     `json:"count,omitempty"`
	Revenue float64 `json:"revenue,omitempty"`
}
