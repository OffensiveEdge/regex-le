import * as nls from 'vscode-nls';

/**
 * Localization utilities
 * Provides helpers for working with vscode-nls
 */

export interface Localizer {
	localize(key: string, ...args: readonly unknown[]): string;
}

/**
 * Create a localizer instance
 */
export function createLocalizer(): Localizer {
	const localize = nls.config({ messageFormat: nls.MessageFormat.file })();

	return Object.freeze({
		localize(key: string, ...args: readonly unknown[]): string {
			// TypeScript strict mode requires explicit cast for spread operator
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return (localize as any)(key, ...args);
		},
	});
}

/**
 * Format a message with placeholders
 */
export function formatMessage(
	template: string,
	...args: readonly unknown[]
): string {
	return template.replace(/{(\d+)}/g, (match, index) => {
		const argIndex = Number.parseInt(index, 10);
		return args[argIndex] !== undefined ? String(args[argIndex]) : match;
	});
}
