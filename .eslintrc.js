module.exports = {
	root: true,
	extends: ["expo", "eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: { jsx: true },
		ecmaVersion: 2020,
		sourceType: "module",
	},
	plugins: ["@typescript-eslint"],
	env: {
		browser: true,
		node: true,
		es6: true,
	},
	rules: {
		// Use tabs instead of spaces
		indent: ["error", "tab", { SwitchCase: 1 }],
		// Allow smart-tabs but prevent mixing spaces for alignment
		"no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
		// Enforce double quotes to match project preference
		quotes: ["error", "double", { avoidEscape: true }],
		// TypeScript-specific relaxations
		"@typescript-eslint/explicit-module-boundary-types": "off",
	},
	settings: {
		react: {
			version: "detect",
		},
	},
};
