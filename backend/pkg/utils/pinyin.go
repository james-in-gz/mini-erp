package utils

import (
	"strings"

	"github.com/mozillazg/go-pinyin"
)

// ToShortCode 生成短码：中文取拼音首字母，英文数字保留
// 示例：ToShortCode("苹果手机") -> "PSJ"
func ToShortCode(text string) string {
	args := pinyin.NewArgs()
	args.Style = pinyin.FirstLetter

	var out strings.Builder
	for _, r := range text {
		if isChinese(r) {
			// 中文：取拼音首字母
			p := pinyin.Pinyin(string(r), args)
			if len(p) > 0 && len(p[0]) > 0 {
				out.WriteString(strings.ToUpper(p[0][0]))
			}
		} else {
			// 非中文：原样保留
			out.WriteRune(r)
		}
	}
	return out.String()
}

// isChinese 判断是否为中文字符
func isChinese(r rune) bool {
	return r >= 0x4E00 && r <= 0x9FFF
}

// ContainsChinese 判断字符串是否包含中文
func ContainsChinese(text string) bool {
	for _, r := range text {
		if isChinese(r) {
			return true
		}
	}
	return false
}

// ExtractChinese 提取字符串中的中文字符
func ExtractChinese(text string) string {
	var out strings.Builder
	for _, r := range text {
		if isChinese(r) {
			out.WriteRune(r)
		}
	}
	return out.String()
}

// GetChineseCount 统计中文字符个数
func GetChineseCount(text string) int {
	count := 0
	for _, r := range text {
		if isChinese(r) {
			count++
		}
	}
	return count
}
