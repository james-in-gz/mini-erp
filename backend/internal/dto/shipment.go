package dto

type CreateShipmentReq struct {
	TrackingNumber string `json:"trackingNumber"`
	Carrier        string `json:"carrier"`

	ReceiverName     string `json:"receiverName"`
	ReceiverPhone    string `json:"receiverPhone"`
	ReceiverProvince string `json:"receiverProvince"`
	ReceiverCity     string `json:"receiverCity"`
	ReceiverDistrict string `json:"receiverDistrict"`
	ReceiverAddress  string `json:"receiverAddress"`

	Items []ShipmentItemReq `json:"items"`
}

type CreateShipmentByExpressReq struct {
	OrderId     uint              `json:"orderId"`
	WarehouseId uint              `json:"warehouseId"`
	Carrier     string            `json:"carrier"`
	ServiceType string            `json:"serviceType"`
	PaymentType string            `json:"paymentType"`
	Weight      int               `json:"weight"`
	ParcelCount int               `json:"parcelCount"`
	Remark      string            `json:"remark"`
	Items       []ShipmentItemReq `json:"items"`
}

type ExpressResponse struct {
	Success   bool   `json:"success"`
	ErrorCode string `json:"errorCode"`
	Message   string `json:"message"`
	WaybillNo string `json:"waybillNo,omitempty"`
	RequestID string `json:"requestId,omitempty"`
}

type ShipmentItemReq struct {
	OrderItemID uint `json:"orderItemId"`
	Quantity    int  `json:"quantity"`
}
