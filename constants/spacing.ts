// Centralized spacing and radius constants for consistent layout across the app
const SPACING = {
	// Page-level spacing
	pagePadding: 16,

	// Standard spacing scale (use these for consistent rhythm)
	xs: 4,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 20,
	"2xl": 24,
	"3xl": 32,
	"4xl": 40,

	// Legacy aliases (for gradual migration)
	tiny: 4,
	small: 8,
	medium: 12,
	large: 16,
	xlarge: 24,

	// Border radius scale
	radius: {
		xs: 7,
		sm: 8,
		md: 12,
		lg: 14,
		xl: 16,
		"2xl": 20,
		"3xl": 24,
		full: 999,
	},

	// Common padding values (for components)
	padding: {
		xs: 6,
		sm: 8,
		md: 14,
		lg: 20,
		xl: 32,
	},

	// Special values (use sparingly, prefer scale above)
	special: {
		none: 0,
		xxs: 2,
		timerGap: 30,
		timerLarge: 36,
	},
} as const;

export default SPACING;
