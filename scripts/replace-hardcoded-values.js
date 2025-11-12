const fs = require('fs');
const path = require('path');

const root = process.cwd();

// Mapping for spacing values to SPACING tokens
const spacingMap = {
	0: 'special.none',
	2: 'special.xxs',
	4: 'xs',
	6: 'padding.xs',
	8: 'sm',
	10: 'radius.sm', // For borderRadius 10
	12: 'md',
	14: 'padding.md',
	16: 'lg',
	20: 'xl',
	24: '2xl',
	30: 'special.timerGap',
	32: '3xl',
	36: 'special.timerLarge',
	40: '4xl',
};

// Mapping for borderRadius values specifically
const radiusMap = {
	7: 'radius.xs',
	8: 'radius.sm',
	10: 'radius.sm', // Close enough to 8
	12: 'radius.md',
	13: 'radius.md', // Close to 12
	14: 'radius.lg',
	15: 'radius.lg', // Close to 14
	16: 'radius.xl',
	20: 'radius["2xl"]',
	24: 'radius["3xl"]',
	999: 'radius.full',
};

// Mapping for fontWeight values
const fontWeightMap = {
	'400': 'regular',
	'500': 'medium',
	'600': 'semibold',
	'700': 'bold',
	'bold': 'bold',
	'normal': 'regular',
};

// Mapping for lineHeight values to TYPOGRAPHY.lineHeights
const lineHeightMap = {
	16: 'xs',
	18: 'sm',
	20: 'base',
	22: 'md',
	24: 'lg',
	26: 'xl',
	28: 'xl', // close enough
	32: '2xl',
	40: '3xl',
};

function replaceInFile(filePath) {
	let src = fs.readFileSync(filePath, 'utf8');
	let modified = false;

	// Skip if already has all imports
	const hasSpacingImport = /import.*SPACING.*from.*constants\/spacing/.test(src);
	const hasTypographyImport = /import.*TYPOGRAPHY.*from.*constants\/typography/.test(src);

	// Check if file needs spacing replacements
	const needsSpacing = /(padding|margin|gap|borderRadius)\s*:\s*\d+/.test(src);
	// Check if file needs typography replacements
	const needsTypography = /(fontWeight|lineHeight)\s*:\s*[\d"']/.test(src);

	// Add imports if needed
	if (needsSpacing && !hasSpacingImport) {
		src = `import SPACING from '@/constants/spacing';\n` + src;
		modified = true;
	}
	if (needsTypography && !hasTypographyImport) {
		src = `import TYPOGRAPHY from '@/constants/typography';\n` + src;
		modified = true;
	}

	// Replace borderRadius with SPACING.radius tokens
	src = src.replace(/borderRadius\s*:\s*(\d+)/g, (match, value) => {
		const num = Number(value);
		const token = radiusMap[num];
		if (!token) return match; // leave unchanged if no mapping
		modified = true;
		return `borderRadius: SPACING.${token}`;
	});

	// Replace all margin/padding variants with SPACING tokens
	src = src.replace(/(padding|margin)(Top|Bottom|Left|Right|Horizontal|Vertical)?\s*:\s*(\d+)/g, (match, prop, dir, value) => {
		const num = Number(value);
		const token = spacingMap[num];
		if (!token) return match; // leave unchanged if no mapping

		modified = true;
		const fullProp = dir ? `${prop}${dir}` : prop;

		// Handle nested properties like padding.xs or special.none
		if (token.includes('.')) {
			const parts = token.split('.');
			// Check if token starts with number (like '2xl', '3xl', '4xl')
			if (/^\d/.test(parts[0])) {
				return `${fullProp}: SPACING['${parts[0]}']`;
			}
			return `${fullProp}: SPACING.${parts[0]}.${parts[1]}`;
		}
		// Use bracket notation for tokens starting with numbers (like '2xl', '3xl')
		if (/^\d/.test(token)) {
			return `${fullProp}: SPACING['${token}']`;
		}
		return `${fullProp}: SPACING.${token}`;
	});

	// Replace gap with SPACING tokens
	src = src.replace(/gap\s*:\s*(\d+)/g, (match, value) => {
		const num = Number(value);
		const token = spacingMap[num];
		if (!token) return match;
		modified = true;

		if (token.includes('.')) {
			const parts = token.split('.');
			if (/^\d/.test(parts[0])) {
				return `gap: SPACING['${parts[0]}']`;
			}
			return `gap: SPACING.${parts[0]}.${parts[1]}`;
		}
		if (/^\d/.test(token)) {
			return `gap: SPACING['${token}']`;
		}
		return `gap: SPACING.${token}`;
	});

	// Replace fontWeight with TYPOGRAPHY.weights
	src = src.replace(/fontWeight\s*:\s*["'](\d+|bold|normal)["']/g, (match, value) => {
		const token = fontWeightMap[value];
		if (!token) return match;
		modified = true;
		return `fontWeight: TYPOGRAPHY.weights.${token}`;
	});

	// Replace lineHeight with TYPOGRAPHY.lineHeights
	src = src.replace(/lineHeight\s*:\s*(\d+)/g, (match, value) => {
		const num = Number(value);
		const token = lineHeightMap[num];
		if (!token) return match;
		modified = true;
		return `lineHeight: TYPOGRAPHY.lineHeights.${token}`;
	});

	if (modified) {
		fs.writeFileSync(filePath, src, 'utf8');
		return true;
	}
	return false;
}

function walk(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const ent of entries) {
		const full = path.join(dir, ent.name);
		if (ent.isDirectory()) {
			if (['node_modules', 'scripts', '.git', '.expo'].includes(ent.name)) continue;
			walk(full);
		} else if (/\.(tsx|ts)$/.test(ent.name)) {
			// Skip constant files themselves
			if (ent.name === 'spacing.ts' || ent.name === 'typography.ts') continue;

			try {
				if (replaceInFile(full)) {
					console.log('Updated', full);
				}
			} catch (e) {
				console.error('Error', full, e.message);
			}
		}
	}
}

console.log('Starting comprehensive replacement...');
walk(root);
console.log('Done!');

function replaceInFile(filePath) {
	let src = fs.readFileSync(filePath, 'utf8');
	let modified = false;

	// Skip if already has all imports
	const hasSpacingImport = /import.*SPACING.*from.*constants\/spacing/.test(src);
	const hasTypographyImport = /import.*TYPOGRAPHY.*from.*constants\/typography/.test(src);

	// Check if file needs spacing replacements
	const needsSpacing = /(padding|margin|gap)\s*:\s*\d+/.test(src);
	// Check if file needs typography replacements
	const needsTypography = /(fontWeight|lineHeight)\s*:\s*[\d"']/.test(src);

	// Add imports if needed
	if (needsSpacing && !hasSpacingImport) {
		src = `import SPACING from '@/constants/spacing';\n` + src;
		modified = true;
	}
	if (needsTypography && !hasTypographyImport) {
		src = `import TYPOGRAPHY from '@/constants/typography';\n` + src;
		modified = true;
	}

	// Replace padding/margin/gap with SPACING tokens
	src = src.replace(/(padding|margin|gap)\s*:\s*(\d+)/g, (match, prop, value) => {
		const num = Number(value);
		const token = spacingMap[num];
		if (!token) return match; // leave unchanged if no mapping

		modified = true;
		// Handle nested properties like padding.xs
		if (token.includes('.')) {
			const parts = token.split('.');
			return `${prop}: SPACING.${parts[0]}.${parts[1]}`;
		}
		// Use bracket notation for tokens starting with numbers (like '2xl', '3xl')
		if (/^\d/.test(token)) {
			return `${prop}: SPACING['${token}']`;
		}
		return `${prop}: SPACING.${token}`;
	});	// Replace fontWeight with TYPOGRAPHY.weights
	src = src.replace(/fontWeight\s*:\s*["'](\d+|bold|normal)["']/g, (match, value) => {
		const token = fontWeightMap[value];
		if (!token) return match;
		modified = true;
		return `fontWeight: TYPOGRAPHY.weights.${token}`;
	});

	// Replace lineHeight with TYPOGRAPHY.lineHeights
	src = src.replace(/lineHeight\s*:\s*(\d+)/g, (match, value) => {
		const num = Number(value);
		const token = lineHeightMap[num];
		if (!token) return match;
		modified = true;
		return `lineHeight: TYPOGRAPHY.lineHeights.${token}`;
	});

	if (modified) {
		fs.writeFileSync(filePath, src, 'utf8');
		return true;
	}
	return false;
}

function walk(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const ent of entries) {
		const full = path.join(dir, ent.name);
		if (ent.isDirectory()) {
			if (['node_modules', 'scripts', '.git', '.expo'].includes(ent.name)) continue;
			walk(full);
		} else if (/\.(tsx|ts)$/.test(ent.name)) {
			// Skip constant files themselves
			if (ent.name === 'spacing.ts' || ent.name === 'typography.ts') continue;

			try {
				if (replaceInFile(full)) {
					console.log('Updated', full);
				}
			} catch (e) {
				console.error('Error', full, e.message);
			}
		}
	}
}

console.log('Starting replacement...');
walk(root);
console.log('Done!');
