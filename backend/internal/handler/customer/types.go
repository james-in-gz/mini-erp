package customer

type CreateCustomerRequest struct {
	Name   string `json:"name" binding:"required"`
	Phone  string `json:"phone" binding:"required"`
	Email  string `json:"email"`
	Source string `json:"source"`
}

type ListCustomersQuery struct {
	Page     int    `form:"page"`
	PageSize int    `form:"pageSize"`
	Status   string `form:"status"`
	Keyword  string `form:"keyword"`
}

type CreateCustomerNoteRequest struct {
	Content        string  `json:"content,omitempty" binding:"required"`
	Type           string  `json:"type,omitempty"`           // call / visit / message
	NextFollowUpAt *string `json:"nextFollowUpAt,omitempty"` // ISO string
}
