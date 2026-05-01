package customer

type CreateCustomerRequest struct {
	Name   string `json:"name" binding:"required"`
	Phone  string `json:"phone" binding:"required"`
	Email  string `json:"email"`
	Source string `json:"source"`
}
