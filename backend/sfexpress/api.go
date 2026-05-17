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

type Document struct {
	MasterWaybillNo string `json:"masterWaybillNo"`
	BranchWaybillNo string `json:"branchWaybillNo,omitempty"`
	Seq             string `json:"seq,omitempty"`
	Sum             string `json:"sum,omitempty"`
	Remark          string `json:"remark,omitempty"`
}

// ================= 响应参数结构体 (对应文档 2.4 & 2.5) =================

// SFApiResponse 顺丰统一外层响应
type SFApiResponse struct {
	ApiResultCode string `json:"apiResultCode"`
	ApiErrorMsg   string `json:"apiErrorMsg"`
	ApiResponseID string `json:"apiResponseID"`
	ApiResultData string `json:"apiResultData"` // 这是一个 JSON 字符串，需要二次解析！
}

// SFBusinessResult 对应 apiResultData 解析后的结构
type SFBusinessResult struct {
	Success      bool       `json:"success"`
	ErrorCode    string     `json:"errorCode"`
	ErrorMessage string     `json:"errorMessage"` // 修正：与顺丰文档保持一致
	RequestID    string     `json:"requestId"`
	Obj          SFLabelObj `json:"obj"` // 顺丰2.0同步返回的核心数据都在 obj 里
}

// SFLabelObj 对应文档 2.5 的 obj
type SFLabelObj struct {
	ClientCode   string        `json:"clientCode"`
	TemplateCode string        `json:"templateCode"`
	FileType     string        `json:"fileType"`
	Files        []SFPrintFile `json:"files"` // 顺丰面单文件集合
}

// SFPrintFile 对应文档 2.5 的 PrintFile
type SFPrintFile struct {
	Url       string `json:"url"`       // PDF 下载地址
	Token     string `json:"token"`     // 下载凭证，需放在请求头 X-Auth-token
	WaybillNo string `json:"waybillNo"` // 运单号
	SeqNo     int    `json:"seqNo"`     // 面单序号
	AreaNo    int    `json:"areaNo"`    // 联编号
	PageNo    int    `json:"pageNo"`    // 页号
	PageCount int    `json:"pageCount"` // 页数
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

func GetWaybillLabel(waybillNo string) (*SFPrintFile, error) {
	// 1. 构造请求参数
	reqData := struct {
		TemplateCode string     `json:"templateCode"`
		Version      string     `json:"version"`
		FileType     string     `json:"fileType"`
		Sync         bool       `json:"sync"`
		Documents    []Document `json:"documents"`
	}{
		TemplateCode: fmt.Sprintf("fm_76130_standard_%s", SFClientCode), // 根据实际模板调整
		Version:      "2.0",
		FileType:     "pdf",
		Sync:         true,
		Documents: []Document{
			{
				MasterWaybillNo: waybillNo,
			},
		},
	}

	jsonBytes, err := json.Marshal(reqData)
	if err != nil {
		return nil, err
	}

	// 2. 发送请求
	respBody, err := sendSFRequest("COM_RECE_CLOUD_PRINT_WAYBILLS", string(jsonBytes), isSandbox)
	if err != nil {
		return nil, err
	}

	// 3. 解析第一层
	var apiResp SFApiResponse
	err = json.Unmarshal([]byte(respBody), &apiResp)
	if err != nil {
		return nil, fmt.Errorf("解析顺丰响应失败: %v", err)
	}
	if apiResp.ApiResultCode != "A1000" {
		return nil, fmt.Errorf("平台错误: %s", apiResp.ApiErrorMsg)
	}

	// 4. 解析第二层业务数据
	var bizResult SFBusinessResult
	err = json.Unmarshal([]byte(apiResp.ApiResultData), &bizResult)
	if err != nil {
		return nil, fmt.Errorf("解析业务数据失败: %v", err)
	}
	if !bizResult.Success {
		return nil, fmt.Errorf("业务错误: [%s] %s", bizResult.ErrorCode, bizResult.ErrorMessage)
	}

	// 5. 校验面单文件
	if len(bizResult.Obj.Files) == 0 {
		return nil, fmt.Errorf("未返回面单文件")
	}

	return &bizResult.Obj.Files[0], nil
}
