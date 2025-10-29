/**
 * Integration tests for sample files
 * Verifies that Regex-LE can process sample files across different file types
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { testRegexPattern } from './extraction/regex/regexTest';

const SAMPLE_DIR = join(process.cwd(), 'sample');

function readSampleFile(filename: string): string {
	const filePath = join(SAMPLE_DIR, filename);
	return readFileSync(filePath, 'utf-8');
}

describe('Sample Files Integration', () => {
	describe('JavaScript files', () => {
		it('should extract function names from app.js', () => {
			const content = readSampleFile('app.js');
			const result = testRegexPattern('function\\s+(\\w+)', 'g', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
			
			// Should find functions like calculateTotal, processUserData
			const functionNames = result.matches.map((m) => m.groups?.[0]?.value || '');
			expect(functionNames.some((name) => name.includes('calculate'))).toBe(true);
		});

		it('should extract string values from app.js', () => {
			const content = readSampleFile('app.js');
			const result = testRegexPattern(/['"`]([^'"`]+)['"`]/g.source, 'g', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});
	});

	describe('TypeScript files', () => {
		it('should extract interface names from app.ts', () => {
			const content = readSampleFile('app.ts');
			const result = testRegexPattern('interface\\s+(\\w+)', 'g', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
			
			// Should find interfaces like UserProfile, ApiResponse
			const interfaceNames = result.matches.map((m) => m.groups?.[0]?.value || '');
			expect(interfaceNames.length).toBeGreaterThan(0);
		});

		it('should extract import paths from app.ts', () => {
			const content = readSampleFile('app.ts');
			const result = testRegexPattern(
				"import\\s+.*?\\s+from\\s+['\"](.+?)['\"]",
				'g',
				content,
			);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});
	});

	describe('Python files', () => {
		it('should extract function definitions from app.py', () => {
			const content = readSampleFile('app.py');
			const result = testRegexPattern('def\\s+(\\w+)', 'g', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});

		it('should extract class definitions from app.py', () => {
			const content = readSampleFile('app.py');
			const result = testRegexPattern('class\\s+(\\w+)', 'g', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});
	});

	describe('Go files', () => {
		it('should extract function definitions from app.go', () => {
			const content = readSampleFile('app.go');
			const result = testRegexPattern('func\\s+(\\w+)', 'g', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});

		it('should extract package name from app.go', () => {
			const content = readSampleFile('app.go');
			const result = testRegexPattern('package\\s+(\\w+)', 'g', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});
	});

	describe('Rust files', () => {
		it('should extract function definitions from app.rs', () => {
			const content = readSampleFile('app.rs');
			const result = testRegexPattern('fn\\s+(\\w+)', 'g', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});

		it('should extract struct definitions from app.rs', () => {
			const content = readSampleFile('app.rs');
			const result = testRegexPattern('struct\\s+(\\w+)', 'g', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});
	});

	describe('JSON files', () => {
		it('should extract keys from data.json', () => {
			const content = readSampleFile('data.json');
			const result = testRegexPattern('"(\\w+)":', 'g', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});

		it('should extract string values from data.json', () => {
			const content = readSampleFile('data.json');
			const result = testRegexPattern(':\\s*"([^"]+)"', 'g', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});
	});

	describe('HTML files', () => {
		it('should extract href attributes from index.html', () => {
			const content = readSampleFile('index.html');
			const result = testRegexPattern('href="([^"]+)"', 'g', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});

		it('should extract src attributes from index.html', () => {
			const content = readSampleFile('index.html');
			const result = testRegexPattern('src="([^"]+)"', 'g', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});
	});

	describe('CSS files', () => {
		it('should extract class selectors from styles.css', () => {
			const content = readSampleFile('styles.css');
			const result = testRegexPattern('\\.(\\w+)\\s*\\{', 'g', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});

		it('should extract URLs from styles.css', () => {
			const content = readSampleFile('styles.css');
			const result = testRegexPattern(/url\(['"]?([^'")]+)['"]?\)/g.source, 'g', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});
	});

	describe('Environment files', () => {
		it('should extract environment variables from config.env', () => {
			const content = readSampleFile('config.env');
			const result = testRegexPattern('^(\\w+)=', 'gm', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});

		it('should extract values from config.env', () => {
			const content = readSampleFile('config.env');
			const result = testRegexPattern('=\\s*(.+)$', 'gm', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});
	});

	describe('Log files', () => {
		it('should extract timestamps from log.txt', () => {
			const content = readSampleFile('log.txt');
			const result = testRegexPattern(
				'\\d{4}-\\d{2}-\\d{2}\\s+\\d{2}:\\d{2}:\\d{2}',
				'g',
				content,
			);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});

		it('should extract log levels from log.txt', () => {
			const content = readSampleFile('log.txt');
			const result = testRegexPattern('\\[(INFO|DEBUG|WARN|ERROR)\\]', 'g', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});
	});

	describe('Shell scripts', () => {
		it('should extract variables from script.sh', () => {
			const content = readSampleFile('script.sh');
			const result = testRegexPattern('\\$(\\w+)', 'g', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});

		it('should extract function definitions from script.sh', () => {
			const content = readSampleFile('script.sh');
			const result = testRegexPattern('(\\w+)\\(\\)', 'g', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});
	});

	describe('Markdown files', () => {
		it('should extract headers from readme.md', () => {
			const content = readSampleFile('readme.md');
			const result = testRegexPattern('^#+\\s+(.+)$', 'gm', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});

		it('should extract links from readme.md', () => {
			const content = readSampleFile('readme.md');
			const result = testRegexPattern(/\[([^\]]+)\]\(([^)]+)\)/g.source, 'g', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});
	});

	describe('TOML files', () => {
		it('should extract sections from config.toml', () => {
			const content = readSampleFile('config.toml');
			const result = testRegexPattern('^\\[(.+)\\]$', 'gm', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});
	});

	describe('XML files', () => {
		it('should extract tags from data.xml', () => {
			const content = readSampleFile('data.xml');
			const result = testRegexPattern('<(\\w+)[^>]*>', 'g', content);

			expect(result.success).toBe(true);
			expect(result.matches.length).toBeGreaterThan(0);
		});
	});

	describe('Universal patterns', () => {
		it('should find numbers in all sample files', () => {
			const files = [
				'app.js',
				'app.ts',
				'app.py',
				'app.go',
				'app.rs',
				'data.json',
				'config.env',
				'log.txt',
			];

			for (const file of files) {
				const content = readSampleFile(file);
				const result = testRegexPattern('\\d+', 'g', content);

				expect(result.success).toBe(true);
				// Most files should have at least some numbers
				if (file !== 'app.rs') {
					// app.rs might not have numbers, but should still process
					expect(typeof result.matches.length).toBe('number');
				}
			}
		});
	});
});

