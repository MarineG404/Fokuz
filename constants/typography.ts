const TYPOGRAPHY = {
	// font sizes in logical pixels (React Native units)
	sizes: {
		xs: 12,
		sm: 14,
		base: 16,
		md: 18,
		lg: 20,
		xl: 24,
		"2xl": 28,
		"3xl": 34,
		"4xl": 40,
	},

	// matching line heights to preserve good vertical rhythm
	lineHeights: {
		xs: 16,
		sm: 18,
		base: 20,
		md: 22,
		lg: 24,
		xl: 26,
		"2xl": 32,
		"3xl": 40,
	},

	// semantic aliases for common UI elements
	alias: {
		caption: 12,
		label: 14,
		button: 16,
		body: 16,
		subtitle: 18,
		h1: 34,
		h2: 28,
		h3: 22,
		h4: 20,
	},

	// font weights (strings so they can be passed directly to style.fontWeight)
	weights: {
		regular: "400" as const,
		medium: "500" as const,
		semibold: "600" as const,
		bold: "700" as const,
	},
} as const;

export default TYPOGRAPHY;
