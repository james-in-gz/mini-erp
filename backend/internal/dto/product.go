package dto

type CreateProductReq struct {
	Name string `json:"name"`
	SPU  string `json:"spu"`
}

type SpecInput struct {
	Key    string   `json:"key"`
	Values []string `json:"values"`
}

type GenerateSKURequest struct {
	Specs []SpecInput `json:"specs"`
}

type UpdateSKUReq struct {
	Name      string  `json:"name,omitempty"`
	Unit      string  `json:"unit,omitempty"`
	Weight    int64   `json:"weight,omitempty"`
	Price     float64 `json:"price,omitempty"`
	CostPrice float64 `json:"costPrice,omitempty"`

	Status string `json:"status,omitempty"` // active / inactive
}
