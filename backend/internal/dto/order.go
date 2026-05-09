package dto

type CreateOrderReq struct {
	CustomerID uint                 `json:"customerId"`
	Items      []CreateOrderItemReq `json:"items"`
}

type CreateOrderItemReq struct {
	SKUID    uint `json:"skuId"`
	Quantity int  `json:"quantity"`
}

type CreatePaymentRequest struct {
	Amount float64 `json:"amount" binding:"required"`

	Method string `json:"method"`

	Remark string `json:"remark"`
}
