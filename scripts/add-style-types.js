const fs = require("fs");
const path = require("path");

const root = process.cwd();

function addStyleTypes(filePath) {
	let src = fs.readFileSync(filePath, "utf8");
	let modified = false;

	// Check if StyleSheet and ViewStyle/TextStyle are imported
	const hasStyleSheetImport = /from\s+["']react-native["']/.test(src);
	const hasViewStyle = /\bViewStyle\b/.test(src);
	const hasTextStyle = /\bTextStyle\b/.test(src);

	if (!hasStyleSheetImport) return false;

	// Add ViewStyle and TextStyle to react-native imports if missing
	if (!hasViewStyle || !hasTextStyle) {
		// Find the react-native import line
		const rnImportMatch = src.match(/import\s+\{([^}]+)\}\s+from\s+["']react-native["']/);
		if (rnImportMatch) {
			const imports = rnImportMatch[1].split(",").map((s) => s.trim());
			const needed = [];
			if (!hasViewStyle && !imports.includes("ViewStyle")) needed.push("ViewStyle");
			if (!hasTextStyle && !imports.includes("TextStyle")) needed.push("TextStyle");

			if (needed.length > 0) {
				const newImports = [...imports, ...needed].join(",\n\t");
				src = src.replace(
					/import\s+\{[^}]+\}\s+from\s+["']react-native["']/,
					`import {\n\t${newImports}\n} from "react-native"`,
				);
				modified = true;
			}
		}
	}

	// Add type annotations to StyleSheet.create
	// Pattern: const styles = StyleSheet.create({
	if (
		/const\s+styles\s*=\s*StyleSheet\.create\s*\(\s*\{/.test(src) &&
		!/const\s+styles:\s*\{/.test(src)
	) {
		// We don't add explicit types to the whole object, but ensure imports are there
		// The real fix is to use specific properties in StyleSheet.create
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
		} else if (/\.tsx$/.test(ent.name)) {
			try {
				if (addStyleTypes(full)) {
					console.log("Updated", full);
				}
			} catch (e) {
				console.error("Error", full, e.message);
			}
		}
	}
}

console.log("Adding style types...");
walk(root);
console.log("Done!");
