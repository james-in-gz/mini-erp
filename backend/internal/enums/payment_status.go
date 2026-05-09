package enums

type PaymentStatus string

const (
	PaymentUnpaid   PaymentStatus = "unpaid"
	PaymentPartial  PaymentStatus = "partial"
	PaymentPaid     PaymentStatus = "paid"
	PaymentRefunded PaymentStatus = "refunded"
)
