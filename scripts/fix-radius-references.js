const fs = require("fs");
const path = require("path");

const root = process.cwd();

function fixRadiusReferences(filePath) {
	let src = fs.readFileSync(filePath, "utf8");
	let modified = false;

	// Replace SPACING.radius with SPACING.radius.lg (most common case)
	const radiusPattern = /borderRadius:\s*SPACING\.radius(?!\.)/g;
	if (radiusPattern.test(src)) {
		src = src.replace(/borderRadius:\s*SPACING\.radius(?!\.)/g, "borderRadius: SPACING.radius.lg");
		modified = true;
	}

	// Replace SPACING.largeRadius with SPACING.radius['3xl']
	if (/SPACING\.largeRadius/.test(src)) {
		src = src.replace(/SPACING\.largeRadius/g, "SPACING.radius['3xl']");
		modified = true;
	}

	// Replace borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius: SPACING.radius
	const specificRadiusPattern =
		/(borderTopLeftRadius|borderTopRightRadius|borderBottomLeftRadius|borderBottomRightRadius):\s*SPACING\.radius(?!\.)/g;
	if (specificRadiusPattern.test(src)) {
		src = src.replace(specificRadiusPattern, "$1: SPACING.radius.lg");
		modified = true;
	}

	if (modified) {
		fs.writeFileSync(filePath, src, "utf8");
		return true;
	}
	return false;
}

function walk(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const ent of entries) {
		const full = path.join(dir, ent.name);
		if (ent.isDirectory()) {
			if (["node_modules", "scripts", ".git", ".expo"].includes(ent.name)) continue;
			walk(full);
		} else if (/\.(tsx|ts)$/.test(ent.name)) {
			if (ent.name === "spacing.ts" || ent.name === "typography.ts") continue;

			try {
				if (fixRadiusReferences(full)) {
					console.log("Fixed", full);
				}
			} catch (e) {
				console.error("Error", full, e.message);
			}
		}
	}
}

console.log("Fixing radius references...");
walk(root);
console.log("Done!");
