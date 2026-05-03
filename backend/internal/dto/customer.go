package dto

type UpdateCustomerRequest struct {
	Name   string `json:"name"`
	Phone  string `json:"phone"`
	Wechat string `json:"wechat"`
	Source string `json:"source"`
	Entry  string `json:"entry"`
	Status string `json:"status"`
}
