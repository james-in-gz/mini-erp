package dto

import "github.com/gin-gonic/gin"

func Success(c *gin.Context, data interface{}) {
	c.JSON(200, gin.H{
		"code":    0,
		"message": "success",
		"data":    data,
	})
}

func Fail(c *gin.Context, msg string) {
	c.JSON(400, gin.H{
		"code":    1,
		"message": msg,
	})
}
