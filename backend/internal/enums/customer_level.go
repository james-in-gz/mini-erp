package enums

type CustomerLifetimeLevel string

const (
	ExperienceMember  CustomerLifetimeLevel = "EXPERIENCE_MEMBER"
	LightcareMember   CustomerLifetimeLevel = "LIGHTCARE_MEMBER"
	PremiumcareMember CustomerLifetimeLevel = "PREMIUMCARE_MEMBER"
	EliteMember       CustomerLifetimeLevel = "ELITE_MEMBER"
	BlackGoldMember   CustomerLifetimeLevel = "BLACK_GOLD_MEMBER"
)

type CustomerLevel string

const (
	Potential CustomerLevel = "POTENTIAL"
	New       CustomerLevel = "NEW"
	Casual    CustomerLevel = "CASUAL"
	Regular   CustomerLevel = "REGULAR"
	VIP       CustomerLevel = "VIP"
	SuperVIP  CustomerLevel = "SUPER_VIP"
)
