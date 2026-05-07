package dto

type CreateOrderReq struct {
	CustomerID uint                 `json:"customerId"`
	Items      []CreateOrderItemReq `json:"items"`
}

type CreateOrderItemReq struct {
	SKUID    uint `json:"skuId"`
	Quantity int  `json:"quantity"`
}
