package sfexpress

import (
	"backend/internal/dto"
	"backend/internal/model"
	"backend/internal/repository"
	"bytes"
	"crypto/md5"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/google/uuid"
)

// ================= 配置 =================

var SFClientCode = os.Getenv("CLIENT_CODE")
var SFCheckWord = os.Getenv("CHECK_WORD")
var SFMonthlyCard = os.Getenv("SF_MONTHLY_CARD")

const isSandbox = false
const (
	SFSandboxURL = "https://sfapi-sbox.sf-express.com/std/service"
	SFProdURL    = "https://bspgw.sf-express.com/std/service"
)

// ================= 顺丰请求结构 =================

type SFOrderRequest struct {
	Language        string        `json:"language"`
	OrderId         string        `json:"orderId"`
	ExpressTypeId   int           `json:"expressTypeId"`
	PayMethod       int           `json:"payMethod"`
	ParcelQty       int           `json:"parcelQty"`
	TotalWeight     float64       `json:"totalWeight"`
	MonthlyCard     string        `json:"monthlyCard,omitempty"`
	ContactInfoList []ContactInfo `json:"contactInfoList"`
	CargoDetails    []CargoItem   `json:"cargoDetails"`
}

type ContactInfo struct {
	ContactType int    `json:"contactType"`
	Contact     string `json:"contact"`
	Mobile      string `json:"mobile"`
	Country     string `json:"country"`
	Province    string `json:"province"`
	City        string `json:"city"`
	County      string `json:"county"`
	Address     string `json:"address"`
}

type CargoItem struct {
	Name   string  `json:"name"`
	Count  int     `json:"count"`
	Weight float64 `json:"weight"`
}

// ================= 你的业务参数 =================

type ShipmentParams struct {
	OrderId     uint   `json:"orderId"`
	WarehouseId uint   `json:"warehouseId"`
	Carrier     string `json:"carrier"`
	ServiceType string `json:"serviceType"`
	PaymentType string `json:"paymentType"`
	Weight      int    `json:"weight"` // gram
	ParcelCount int    `json:"parcelCount"`
	Remark      string `json:"remark"`
}

// ================= HTTP Client =================

var sfClient = &http.Client{
	Timeout: 60 * time.Second,
	Transport: &http.Transport{
		MaxIdleConns:        100,
		IdleConnTimeout:     90 * time.Second,
		TLSHandshakeTimeout: 30 * time.Second,
	},
}

// ================= 签名 =================
//QtFHtmtINpBWMI9G4YNcCwRFku3EST68
//QtFHtmtINpBWMI9G4YNcCwRFku3EST68

// 顺丰签名规则：
// base64(md5(msgData + timestamp + checkWord))

func generateSign(msgData, timestamp string) string {

	raw := msgData + timestamp + SFCheckWord

	// 顺丰要求先 URL Encode
	encoded := url.QueryEscape(raw)

	md := md5.Sum([]byte(encoded))

	return base64.StdEncoding.EncodeToString(md[:])
}

// ================= 发送请求 =================

func sendSFRequest(serviceCode string, msgData string, isSandbox bool) (string, error) {

	fmt.Println("CLIENT_CODE=", SFClientCode)
	fmt.Println("CHECK_WORD=", SFCheckWord)

	apiURL := SFProdURL

	if isSandbox {
		apiURL = SFSandboxURL
	}

	timestamp := time.Now().Format("20060102150405")

	form := url.Values{}

	form.Set("partnerID", SFClientCode)
	form.Set("requestID", uuid.New().String())
	form.Set("serviceCode", serviceCode)
	form.Set("timestamp", timestamp)
	form.Set("msgData", msgData)

	sign := generateSign(msgData, timestamp)

	form.Set("msgDigest", sign)

	encodedForm := form.Encode()

	fmt.Println("========== 顺丰请求 ==========")
	fmt.Println(encodedForm)

	req, err := http.NewRequest(
		"POST",
		apiURL,
		bytes.NewBufferString(encodedForm),
	)

	if err != nil {
		return "", err
	}

	req.Header.Set(
		"Content-Type",
		"application/x-www-form-urlencoded",
	)

	resp, err := sfClient.Do(req)

	if err != nil {
		return "", err
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)

	if err != nil {
		return "", err
	}

	fmt.Println("========== 顺丰响应 ==========")
	fmt.Println(string(body))

	return string(body), nil
}

// ================= 构建顺丰 JSON =================

func buildSFOrderJSON(
	params ShipmentParams,
	order model.Order,
) (string, error) {

	payMethod := 1

	if params.PaymentType == "RECEIVER" {
		payMethod = 2
	}

	expressType := 1

	if params.ServiceType == "EXPRESS" {
		expressType = 2
	}

	sender := getSenderInfo(params.WarehouseId)

	if sender == nil {
		return "", fmt.Errorf("寄件仓库不存在")
	}

	weightKG := float64(params.Weight) / 1000

	if weightKG <= 0 {
		weightKG = 0.1
	}

	req := SFOrderRequest{
		Language:      "zh-CN",
		OrderId:       order.OrderNo,
		ExpressTypeId: expressType,
		PayMethod:     payMethod,
		ParcelQty:     params.ParcelCount,
		TotalWeight:   weightKG,
		MonthlyCard:   SFMonthlyCard,

		ContactInfoList: []ContactInfo{
			{
				ContactType: 1,
				Contact:     sender.Contact,
				Mobile:      sender.Mobile,
				Country:     "CN",
				Province:    sender.Province,
				City:        sender.City,
				County:      sender.County,
				Address:     sender.Address,
			},
			{
				ContactType: 2,
				Contact:     order.DefaultName,
				Mobile:      order.DefaultPhone,
				Country:     "CN",
				Province:    order.DefaultProvince,
				City:        order.DefaultCity,
				County:      order.DefaultDistrict,
				Address:     order.DefaultAddress,
			},
		},

		CargoDetails: []CargoItem{
			{
				Name:   "商品",
				Count:  1,
				Weight: weightKG,
			},
		},
	}

	jsonBytes, err := json.Marshal(req)

	if err != nil {
		return "", err
	}

	return string(jsonBytes), nil
}

// ================= 获取仓库 =================

func getSenderInfo(warehouseId uint) *ContactInfo {

	warehouse, err := repository.GetByID(warehouseId)

	if err != nil {
		return nil
	}

	return &ContactInfo{
		Contact:  warehouse.Name,
		Mobile:   warehouse.Phone,
		Province: warehouse.Province,
		City:     warehouse.City,
		County:   warehouse.District,
		Address:  warehouse.Address,
	}
}

// ================= 获取订单 =================

func getOrderInfo(orderId uint) (model.Order, error) {
	return repository.GetOrderByID(orderId)
}

// ================= 顺丰响应结构 =================

type SFResponse struct {
	ApiResultCode string `json:"apiResultCode"`
	ApiErrorMsg   string `json:"apiErrorMsg"`

	ApiResultData string `json:"apiResultData"`
}

type SFResultData struct {
	Success   bool   `json:"success"`
	ErrorMsg  string `json:"errorMsg"`
	ErrorCode string `json:"errorCode"`

	MsgData struct {
		OrderId string `json:"orderId"`

		WaybillNoInfoList []struct {
			WaybillNo string `json:"waybillNo"`
		} `json:"waybillNoInfoList"`
	} `json:"msgData"`
}

// ================= 解析响应 =================

func parseSFResponse(respBody string) (*dto.ExpressResponse, error) {

	var raw SFResponse

	err := json.Unmarshal([]byte(respBody), &raw)
	if err != nil {
		return nil, fmt.Errorf("解析顺丰响应失败: %v", err)
	}

	// 第二层解析
	var resultData SFResultData

	if raw.ApiResultData != "" {

		err = json.Unmarshal(
			[]byte(raw.ApiResultData),
			&resultData,
		)

		if err != nil {
			return nil, fmt.Errorf(
				"解析 apiResultData 失败: %v",
				err,
			)
		}
	}

	result := &dto.ExpressResponse{
		Success:   resultData.Success,
		ErrorCode: resultData.ErrorCode,
		Message:   resultData.ErrorMsg,
	}

	if len(resultData.MsgData.WaybillNoInfoList) > 0 {

		result.WaybillNo =
			resultData.MsgData.
				WaybillNoInfoList[0].
				WaybillNo
	}

	return result, nil
}

// ================= 主入口 =================

func AutoShip(
	params ShipmentParams,
) (*dto.ExpressResponse, error) {

	orderInfo, err := getOrderInfo(params.OrderId)

	if err != nil {
		return nil, fmt.Errorf(
			"获取订单失败: %v",
			err,
		)
	}

	reqJSON, err := buildSFOrderJSON(
		params,
		orderInfo,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"构建顺丰请求失败: %v",
			err,
		)
	}

	fmt.Println("========== 请求JSON ==========")
	fmt.Println(reqJSON)

	respBody, err := sendSFRequest(
		"EXP_RECE_CREATE_ORDER",
		reqJSON,
		isSandbox,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"调用顺丰失败: %v",
			err,
		)
	}

	sfResp, err := parseSFResponse(respBody)

	if err != nil {
		return nil, err
	}

	if sfResp.Success {

		fmt.Println(
			"发货成功，单号:",
			sfResp.WaybillNo,
		)

		// TODO:
		// 保存运单号到shipment表

	} else {

		fmt.Println(
			"顺丰下单失败:",
			sfResp.Message,
		)
	}

	return sfResp, nil
}

func GetWaybillLabel(waybillNo string) (*dto.LabelResponse, error) {

	// 顺丰查询接口
	serviceCode := "EXP_RECE_SEARCH_ORDER_RESP"

	// msgData 必须是 JSON 字符串
	req := map[string]any{
		"waybillNo": waybillNo,
	}

	jsonBytes, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	resp, err := sendSFRequest(
		serviceCode,
		string(jsonBytes),
		isSandbox, // sandbox
	)

	if err != nil {
		return nil, err
	}

	// 顺丰返回结构（面单通常在 base64 或 pdf 字段）
	var raw struct {
		ApiResultCode string `json:"apiResultCode"`
		ApiResultData string `json:"apiResultData"`
		ApiErrorMsg   string `json:"apiErrorMsg"`
	}

	if err := json.Unmarshal([]byte(resp), &raw); err != nil {
		return nil, err
	}

	var data struct {
		Success   bool   `json:"success"`
		ErrorCode string `json:"errorCode"`
		Message   string `json:"errorMsg"`
		MsgData   struct {
			WaybillNo string `json:"waybillNo"`

			// ⭐ 重点：面单数据（顺丰一般是这个字段）
			MailNo      string `json:"mailNo"`
			WaybillCode string `json:"waybillCode"`

			// PDF / ZPL / image base64（不同账号返回不同）
			Documents []struct {
				Code string `json:"code"`
				Url  string `json:"url"`
				Data string `json:"data"`
			} `json:"documents"`
		} `json:"msgData"`
	}

	if raw.ApiResultData != "" {
		_ = json.Unmarshal([]byte(raw.ApiResultData), &data)
	}

	return &dto.LabelResponse{
		Success:   data.Success,
		ErrorCode: data.ErrorCode,
		Message:   data.Message,
		WaybillNo: waybillNo,
		// 常见：PDF base64 或 URL
		LabelData: data.MsgData.Documents,
	}, nil
}
