package order

import (
	"backend/internal/dto"
	"backend/internal/service"
	"io"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateShipment(c *gin.Context) {
	orderID, err := strconv.Atoi(c.Param("id"))
	if err != nil || orderID <= 0 {
		dto.Fail(c, "invalid order id")
		return
	}

	var req dto.CreateShipmentReq
	if err := c.ShouldBindJSON(&req); err != nil {
		dto.Fail(c, err.Error())
		return
	}

	err = service.CreateShipment(uint(orderID), req)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, gin.H{"message": "shipment created"})
}

func ListShipments(c *gin.Context) {
	orderID, err := strconv.Atoi(c.Param("id"))
	if err != nil || orderID <= 0 {
		dto.Fail(c, "invalid order id")
		return
	}

	data, err := service.ListShipments(uint(orderID))
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, data)

}

func CreateShipmentByExpress(c *gin.Context) {
	orderID, err := strconv.Atoi(c.Param("id"))
	if err != nil || orderID <= 0 {
		dto.Fail(c, "invalid order id")
		return
	}

	var req dto.CreateShipmentByExpressReq
	if err := c.ShouldBindJSON(&req); err != nil {
		dto.Fail(c, err.Error())
		return
	}

	respnose, err := service.CreateShipmentByExpress(uint(orderID), req)
	if err != nil {
		dto.Fail(c, err.Error())
		return
	}

	dto.Success(c, respnose)
}

func GetExpressLabel(c *gin.Context) {

	waybillNo := c.Query("waybillNo")
	if waybillNo == "" {
		dto.Fail(c, "invalid waybillNo")
		return
	}

	resp, err := service.GetExpressLabel(waybillNo)
	if err != nil {
		c.JSON(500, gin.H{
			"message": err.Error(),
		})
		return
	}

	dto.Success(c, resp)
}

func ProxyWaybillLabelPDF(c *gin.Context) {
	waybillNo := c.Param("waybillNo")
	if waybillNo == "" {
		dto.Fail(c, "invalid waybillNo")
		return
	}

	// 1. 调用顺丰接口拿到 url 和 token
	labelResp, _ := service.GetExpressLabel(waybillNo)
	pdfUrl := labelResp.Url
	pdfToken := labelResp.Token

	// 2. 后端发起请求下载 PDF 字节流
	req, _ := http.NewRequest("GET", pdfUrl, nil)
	req.Header.Set("X-Auth-token", pdfToken)
	resp, _ := http.DefaultClient.Do(req)
	defer resp.Body.Close()

	// 3. 设置响应头，告诉前端这是 PDF 流
	c.Header("Content-Type", "application/pdf")
	// 可选：如果希望前端下载而不是预览，加上下面这行
	// c.Header("Content-Disposition", "attachment; filename=waybill.pdf")

	// 4. 把顺丰返回的流直接透传给前端
	io.Copy(c.Writer, resp.Body)
}
