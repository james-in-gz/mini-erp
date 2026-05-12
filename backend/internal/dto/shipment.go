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

	Items []struct {
		OrderItemID uint `json:"orderItemId"`
		Quantity    int  `json:"quantity"`
	} `json:"items"`
}

type CreateShipmentByExpressReq struct {
	OrderId     uint   `json:"orderId"`
	WarehouseId uint   `json:"warehouseId"`
	Carrier     string `json:"carrier"`
	ServiceType string `json:"serviceType"`
	PaymentType string `json:"paymentType"`
	Weight      int    `json:"weight"`
	ParcelCount int    `json:"parcelCount"`
	Remark      string `json:"remark"`
}

type ExpressResponse struct {
	Success   bool   `json:"success"`
	Result    string `json:"result"`    // 响应码
	MsgData   string `json:"msgData"`   // 错误信息
	WaybillNo string `json:"waybillNo"` // 运单号
}
