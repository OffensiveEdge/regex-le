/**
 * Extract regex patterns from code/text
 * Finds patterns in various formats: /pattern/flags, new RegExp(), etc.
 */

export interface ExtractedRegexPattern {
	readonly pattern: string;
	readonly flags: string;
	readonly line: number;
	readonly column: number;
	readonly match: string; // The full match string (e.g., "/pattern/gi" or "new RegExp(...)")
}

/**
 * Extract all regex patterns from text content
 */
export function extractRegexPatterns(
	text: string,
): readonly ExtractedRegexPattern[] {
	const patterns: ExtractedRegexPattern[] = [];
	const lines = text.split(/\r?\n/);

	// Track what we've already found to avoid duplicates
	const foundPatterns = new Set<string>();

	for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
		const line = lines[lineIndex] || '';

		// Pattern 1: Literal regex like /pattern/flags or /pattern/
		// Match forward slashes with escape handling
		const literalRegexPattern = /\/(?:[^/\r\n\\]|\\.)+\/[gimsuvy]*/g;
		let match: RegExpExecArray | null;

		// Reset regex for each line
		literalRegexPattern.lastIndex = 0;
		while ((match = literalRegexPattern.exec(line)) !== null) {
			const fullMatch = match[0] || '';
			const patternMatch = fullMatch.match(/^\/(.+)\/([gimsuvy]*)$/);
			if (patternMatch) {
				const pattern = patternMatch[1] || '';
				const flags = patternMatch[2] || '';
				const key = `${pattern}::${flags}`;
				if (!foundPatterns.has(key)) {
					foundPatterns.add(key);
					const matchIndex = match.index || 0;
					patterns.push(
						Object.freeze({
							pattern,
							flags,
							line: lineIndex + 1,
							column: matchIndex + 1,
							match: fullMatch,
						}),
					);
				}
			}
		}

		// Pattern 2: new RegExp('pattern', 'flags') or new RegExp("pattern", "flags")
		const regExpConstructorPattern =
			/new\s+RegExp\s*\(\s*['"]([^'"]+)['"]\s*(?:,\s*['"]([gimsuvy]*)['"])?\)/gi;
		regExpConstructorPattern.lastIndex = 0;
		while ((match = regExpConstructorPattern.exec(line)) !== null) {
			const pattern = match[1] || '';
			const flags = match[2] || '';
			const key = `${pattern}::${flags}`;
			if (!foundPatterns.has(key) && pattern.length > 0) {
				foundPatterns.add(key);
				const matchIndex = match.index || 0;
				patterns.push(
					Object.freeze({
						pattern,
						flags,
						line: lineIndex + 1,
						column: matchIndex + 1,
						match: match[0] || '',
					}),
				);
			}
		}

		// Pattern 3: RegExp('pattern', 'flags') - without 'new'
		const regExpCallPattern =
			/(?:^|[^a-zA-Z])RegExp\s*\(\s*['"]([^'"]+)['"]\s*(?:,\s*['"]([gimsuvy]*)['"])?\)/gi;
		regExpCallPattern.lastIndex = 0;
		while ((match = regExpCallPattern.exec(line)) !== null) {
			const pattern = match[1] || '';
			const flags = match[2] || '';
			const key = `${pattern}::${flags}`;
			if (!foundPatterns.has(key) && pattern.length > 0) {
				foundPatterns.add(key);
				const matchIndex = match.index || 0;
				patterns.push(
					Object.freeze({
						pattern,
						flags,
						line: lineIndex + 1,
						column: matchIndex + 1,
						match: match[0] || '',
					}),
				);
			}
		}
	}

	return Object.freeze(patterns);
}
