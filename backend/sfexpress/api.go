package sfexpress

import (
	"backend/internal/model"
	"backend/internal/repository"
	"bytes"
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

// ========== 配置 ==========
const (
	SFClientCode = "YOUR_CLIENT_CODE" // 顺丰顾客编码
	SFCheckWord  = "YOUR_CHECK_WORD"  // 顺丰校验码
	SFSandboxURL = "https://sfapi-sbox.sf-express.com/std/service"
	SFProdURL    = "https://sfapi.sf-express.com/std/service"
)

// ========== 请求结构 ==========

// 顺丰下单请求（JSON格式）
type SFOrderRequest struct {
	OrderId     string       `json:"orderId"`     // 客户订单号
	ExpressType string       `json:"expressType"` // 快件类型：1-标准快递 2-顺丰特快
	PayMethod   int          `json:"payMethod"`   // 付款方式：1-寄方付 2-收方付
	ParcelQty   int          `json:"parcelQty"`   // 包裹数量
	TotalWeight float64      `json:"totalWeight"` // 总重量(kg)
	Sender      *ContactInfo `json:"sender"`      // 寄件人
	Receiver    *ContactInfo `json:"receiver"`    // 收件人
	CargoList   []CargoItem  `json:"cargoList"`   // 货物列表
}

type ContactInfo struct {
	Name     string `json:"name"`
	Mobile   string `json:"mobile"`
	Province string `json:"province"`
	City     string `json:"city"`
	County   string `json:"county"`
	Address  string `json:"address"`
}

type CargoItem struct {
	Name   string  `json:"name"`   // 货物名称
	Count  int     `json:"count"`  // 数量
	Weight float64 `json:"weight"` // 单个重量(kg)
}

// 顺丰响应（JSON格式）
type SFOrderResponse struct {
	Success   bool   `json:"success"`
	Result    string `json:"result"`    // 响应码
	MsgData   string `json:"msgData"`   // 错误信息
	WaybillNo string `json:"waybillNo"` // 运单号
}

// 你的发货参数（从接口接收）
type ShipmentParams struct {
	OrderId     uint   `json:"orderId"`
	WarehouseId uint   `json:"warehouseId"`
	Carrier     string `json:"carrier"`
	ServiceType string `json:"serviceType"`
	PaymentType string `json:"paymentType"`
	Weight      int    `json:"weight"`
	ParcelCount int    `json:"parcelCount"`
	Remark      string `json:"remark"`
}

// ========== 核心函数 ==========

// 1. 生成签名
func generateSign(msgData string) string {
	// 签名规则：MD5(请求报文JSON + 校验码)
	data := msgData + SFCheckWord
	hash := md5.Sum([]byte(data))
	return strings.ToUpper(hex.EncodeToString(hash[:]))
}

// 2. 发送顺丰请求
func sendSFRequest(serviceCode string, msgData string, isSandbox bool) (string, error) {
	// 选择环境
	apiURL := SFProdURL
	if isSandbox {
		apiURL = SFSandboxURL
	}

	// 构建form参数
	formData := fmt.Sprintf(
		"service=%s&partner_id=%s&timestamp=%s&msg_data=%s&msg_digest=%s&format=json",
		serviceCode,
		SFClientCode,
		time.Now().Format("2006-01-02 15:04:05"),
		msgData,
		generateSign(msgData),
	)

	// 发送请求
	resp, err := http.Post(apiURL, "application/x-www-form-urlencoded;charset=utf-8", bytes.NewBufferString(formData))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}

// 3. 构建顺丰下单请求的JSON
func buildSFOrderJSON(params ShipmentParams, order model.Order) (string, error) {
	// 付款方式映射
	payMethod := 1 // 默认寄方付
	if params.PaymentType == "collect" {
		payMethod = 2 // 收方付
	}

	// 快递类型映射
	expressType := "1" // 默认标准快递
	if params.ServiceType == "express" {
		expressType = "2" // 顺丰特快
	}

	req := SFOrderRequest{
		OrderId:     order.OrderNo,
		ExpressType: expressType,
		PayMethod:   payMethod,
		ParcelQty:   params.ParcelCount,
		TotalWeight: float64(params.Weight) / 1000,     // 转换为kg
		Sender:      getSenderInfo(params.WarehouseId), // 根据仓库获取寄件人
		Receiver: &ContactInfo{
			Name:     order.DefaultName,
			Mobile:   order.DefaultPhone,
			Province: order.DefaultProvince,
			City:     order.DefaultCity,
			County:   order.DefaultDistrict,
			Address:  order.DefaultAddress,
		},
		CargoList: []CargoItem{
			// 简化：可以传商品列表，这里用默认
			{Name: "商品", Count: 1, Weight: float64(params.Weight) / 1000},
		},
	}

	jsonBytes, err := json.Marshal(req)
	if err != nil {
		return "", err
	}

	return string(jsonBytes), nil
}

// 4. 根据仓库ID获取寄件人信息（你需要自己实现）
func getSenderInfo(warehouseId uint) *ContactInfo {
	// TODO: 从数据库或配置中获取仓库地址
	warehouse, error := repository.GetByID(warehouseId)
	if error != nil {
		return nil
	}
	return &ContactInfo{
		Name:     warehouse.Name,
		Mobile:   warehouse.Phone,
		Province: warehouse.Province,
		City:     warehouse.City,
		County:   warehouse.District,
		Address:  warehouse.Address,
	}
}

// 5. 根据订单ID获取收件人信息（你需要自己实现）
func getOrderInfo(orderId uint) (model.Order, error) {
	return repository.GetOrderByID(orderId)
}

// 6. 解析顺丰响应
func parseSFResponse(respBody string) (*SFOrderResponse, error) {
	var rawResp struct {
		ApiResultCode string `json:"apiResultCode"`
		ApiErrorMsg   string `json:"apiErrorMsg"`
		ApiResponse   struct {
			OrderResponse struct {
				OrderId   string `json:"orderId"`
				WaybillNo string `json:"waybillNo"`
				FilterMsg string `json:"filterMsg"`
			} `json:"OrderResponse"`
		} `json:"apiResponse"`
	}

	if err := json.Unmarshal([]byte(respBody), &rawResp); err != nil {
		return nil, fmt.Errorf("解析响应失败: %v", err)
	}

	result := &SFOrderResponse{
		Success:   rawResp.ApiResultCode == "A1000",
		Result:    rawResp.ApiResultCode,
		MsgData:   rawResp.ApiErrorMsg,
		WaybillNo: rawResp.ApiResponse.OrderResponse.WaybillNo,
	}

	return result, nil
}

// 7. 主函数：自动发货
func AutoShip(params ShipmentParams) (*SFOrderResponse, error) {
	// Step 1: 根据orderId获取订单信息（收件人地址等）
	orderInfo, err := getOrderInfo(params.OrderId)
	if err != nil {
		return nil, fmt.Errorf("获取订单信息失败: %v", err)
	}

	// Step 2: 构建顺丰请求JSON
	reqJSON, err := buildSFOrderJSON(params, orderInfo)
	if err != nil {
		return nil, fmt.Errorf("构建请求失败: %v", err)
	}

	fmt.Println("请求JSON:", reqJSON)

	// Step 3: 发送请求到顺丰
	respBody, err := sendSFRequest("EXP_RECE_CREATE_ORDER", reqJSON, true) // true=沙箱环境
	if err != nil {
		return nil, fmt.Errorf("调用顺丰接口失败: %v", err)
	}

	fmt.Println("响应:", respBody)

	// Step 4: 解析响应
	sfResp, err := parseSFResponse(respBody)
	if err != nil {
		return nil, err
	}

	// Step 5: 如果成功，保存单号到数据库
	if sfResp.Success {
		// TODO: 保存 sfResp.WaybillNo 到订单的发货记录表
		fmt.Printf("发货成功！顺丰单号: %s\n", sfResp.WaybillNo)
	} else {
		fmt.Printf("发货失败: %s\n", sfResp.MsgData)
	}

	return sfResp, nil
}

// ========== 使用示例 ==========
func main() {

	// 自动发货示例
	params := ShipmentParams{
		OrderId:     123,
		WarehouseId: 1,
		Carrier:     "sf",
		ServiceType: "standard",
		PaymentType: "prepaid",
		Weight:      2500, // 2.5kg
		ParcelCount: 1,
		Remark:      "易碎品",
	}

	result, err := AutoShip(params)
	if err != nil {
		fmt.Println("自动发货错误:", err)
		return
	}

	if result.Success {
		fmt.Println("自动发货成功，单号:", result.WaybillNo)
	} else {
		fmt.Println("自动发货失败:", result.MsgData)
	}
}
