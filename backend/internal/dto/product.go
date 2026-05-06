package dto

type CreateProductReq struct {
	Name string `json:"name"`
	SPU  string `json:"spu"`
}

type CreateSKUReq struct {
	Name     string  `json:"name"`     // 如：500g装 / 红色 / 套餐A
	Category string  `json:"category"` // 如：规格 / 颜色 / 套餐
	Factory  string  `json:"factory"`  // 生产厂家
	Craft    string  `json:"craft"`    // 工艺要求
	Spec     string  `json:"spec"`     // 规格型号
	Unit     string  `json:"unit"`     // 单位，如：瓶 / 盒 / 袋
	Price    float64 `json:"price"`
}
