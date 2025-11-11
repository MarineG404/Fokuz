#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// Simple WCAG contrast checker (no deps)
function hexToRgb(hex) {
	const h = hex.replace("#", "").trim();
	if (h.length === 3) {
		return [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)];
	}
	return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)];
}

function srgbToLinear(c) {
	c = c / 255;
	return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
	const [r, g, b] = hexToRgb(hex);
	return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function contrastRatio(hex1, hex2) {
	const L1 = luminance(hex1);
	const L2 = luminance(hex2);
	const lighter = Math.max(L1, L2);
	const darker = Math.min(L1, L2);
	return (lighter + 0.05) / (darker + 0.05);
}

function parseColorsFromFile(filePath) {
	const txt = fs.readFileSync(filePath, "utf8");
	const objRegex = /export const (light|dark) = \{([\s\S]*?)\};/g;
	const result = {};
	let m;
	while ((m = objRegex.exec(txt)) !== null) {
		const name = m[1];
		const body = m[2];
		const pairRegex = /([a-zA-Z0-9_]+)\s*:\s*"(#?[0-9a-fA-F]{3,8})"/g;
		result[name] = {};
		let p;
		while ((p = pairRegex.exec(body)) !== null) {
			result[name][p[1]] = p[2];
		}
	}
	return result;
}

// Use process.cwd() so the script is lint-friendly and works when run from project root
const file = path.resolve(process.cwd(), "constants", "color.ts");
if (!fs.existsSync(file)) {
	console.error("constants/color.ts not found");
	process.exit(1);
}

const colors = parseColorsFromFile(file);

function checkTheme(themeName, themeObj) {
	console.log("\nTheme:", themeName);
	const checks = [
		{ label: "text on background", fg: "text", bg: "background" },
		{ label: "textSecondary on background", fg: "textSecondary", bg: "background" },
		{ label: "text on card", fg: "text", bg: "card" },
		{ label: "textSecondary on card", fg: "textSecondary", bg: "card" },
		{ label: "primary on background", fg: "primary", bg: "background" },
	];

	checks.forEach((c) => {
		const fg = themeObj[c.fg];
		const bg = themeObj[c.bg];
		if (!fg || !bg) {
			console.log(` - ${c.label}: SKIP (missing ${!fg ? c.fg : c.bg})`);
			return;
		}
		const ratio = contrastRatio(fg, bg);
		const pass = ratio >= 4.5;
		console.log(` - ${c.label}: ${ratio.toFixed(2)} :1 -> ${pass ? "PASS" : "FAIL"}`);
	});
}

console.log("Running WCAG AA (4.5:1) contrast checks");
if (colors.light) checkTheme("light", colors.light);
if (colors.dark) checkTheme("dark", colors.dark);

// summary
function summary() {
	const failures = [];
	["light", "dark"].forEach((theme) => {
		if (!colors[theme]) return;
		const t = colors[theme];
		const pairs = [
			["text", "background", "text on background"],
			["textSecondary", "background", "textSecondary on background"],
			["text", "card", "text on card"],
			["textSecondary", "card", "textSecondary on card"],
			["primary", "background", "primary on background"],
		];
		pairs.forEach(([fg, bg, label]) => {
			if (!t[fg] || !t[bg]) return;
			const r = contrastRatio(t[fg], t[bg]);
			if (r < 4.5) failures.push({ theme, label, ratio: r.toFixed(2), fg: t[fg], bg: t[bg] });
		});
	});
	console.log("\nSummary:");
	if (failures.length === 0) {
		console.log("All checked pairs PASS WCAG AA (4.5:1)");
		process.exit(0);
	}
	console.log(failures.length + " failing pairs:");
	failures.forEach((f) => {
		console.log(` - [${f.theme}] ${f.label}: ${f.ratio} (fg=${f.fg}, bg=${f.bg})`);
	});
	process.exit(2);
}

summary();
