package customer

type CreateCustomerRequest struct {
	Name   string `json:"name" binding:"required"`
	Phone  string `json:"phone" binding:"required"`
	Email  string `json:"email"`
	Source string `json:"source"`
}

type ListCustomersQuery struct {
	Page     int    `form:"page"`
	PageSize int    `form:"page_size"`
	Status   string `form:"status"`
	Keyword  string `form:"keyword"`
}
