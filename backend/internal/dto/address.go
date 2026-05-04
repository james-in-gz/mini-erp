package dto

type CreateAddressRequest struct {
	Name  string `json:"name"`
	Phone string `json:"phone"`

	Province string `json:"province"`
	City     string `json:"city"`
	District string `json:"district"`

	Address string `json:"address"`
}
