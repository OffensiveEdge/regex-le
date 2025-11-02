/**
 * Settings validation schema and validator
 * Provides type-safe validation for imported settings to prevent malicious or invalid configuration
 */

/**
 * Allowed setting keys with their type and validation rules
 */
export const SETTINGS_SCHEMA = Object.freeze({
	// Core settings
	copyToClipboardEnabled: { type: 'boolean' as const },
	notificationsLevel: {
		type: 'string' as const,
		enum: ['all', 'important', 'silent'] as const,
	},
	openResultsSideBySide: { type: 'boolean' as const },
	telemetryEnabled: { type: 'boolean' as const },

	// Safety settings
	'safety.enabled': { type: 'boolean' as const },
	'safety.fileSizeWarnBytes': {
		type: 'number' as const,
		min: 1000,
		max: 100_000_000, // 100MB max
	},
	'safety.largeOutputLinesThreshold': {
		type: 'number' as const,
		min: 100,
		max: 10_000_000, // 10M lines max
	},

	// Status bar settings
	'statusBar.enabled': { type: 'boolean' as const },

	// Performance settings
	'performance.enabled': { type: 'boolean' as const },
	'performance.maxDuration': {
		type: 'number' as const,
		min: 1000,
		max: 300_000, // 5 minutes max
	},
	'performance.maxMemoryUsage': {
		type: 'number' as const,
		min: 1_048_576, // 1MB min
		max: 1_073_741_824, // 1GB max
	},

	// Regex settings
	'regex.realtimePreviewEnabled': { type: 'boolean' as const },
	'regex.redosDetectionEnabled': { type: 'boolean' as const },
	'regex.maxMatchLimit': {
		type: 'number' as const,
		min: 10,
		max: 10000,
	},
});

/**
 * Type for valid setting keys
 */
export type SettingKey = keyof typeof SETTINGS_SCHEMA;

/**
 * Validation result
 */
export interface ValidationResult {
	readonly valid: boolean;
	readonly errors: readonly string[];
	readonly validSettings: Readonly<Record<string, unknown>>;
}

/**
 * Validates a setting value against its schema
 */
function validateValue(
	key: string,
	value: unknown,
	schema: (typeof SETTINGS_SCHEMA)[SettingKey],
): string | null {
	// Check type
	const actualType = typeof value;
	if (actualType !== schema.type) {
		return `Setting "${key}": Expected ${schema.type}, got ${actualType}`;
	}

	// Check enum values
	if ('enum' in schema && schema.enum) {
		const enumValues = schema.enum as readonly unknown[];
		if (!enumValues.includes(value)) {
			return `Setting "${key}": Value "${value}" not in allowed values: ${enumValues.join(', ')}`;
		}
	}

	// Check number constraints
	if (schema.type === 'number' && typeof value === 'number') {
		// Check finite first to catch Infinity and NaN
		if (!Number.isFinite(value)) {
			return `Setting "${key}": Value must be a finite number`;
		}
		if ('min' in schema && schema.min !== undefined && value < schema.min) {
			return `Setting "${key}": Value ${value} is below minimum ${schema.min}`;
		}
		if ('max' in schema && schema.max !== undefined && value > schema.max) {
			return `Setting "${key}": Value ${value} is above maximum ${schema.max}`;
		}
	}

	// Check string constraints
	if (schema.type === 'string' && typeof value === 'string') {
		if (value.length > 500) {
			return `Setting "${key}": String value too long (max 500 characters)`;
		}
	}

	return null;
}

/**
 * Validates imported settings against the schema
 * Returns validation result with errors and sanitized valid settings
 */
export function validateSettings(settings: unknown): ValidationResult {
	const errors: string[] = [];
	const validSettings: Record<string, unknown> = {};

	// Check if settings is an object
	if (typeof settings !== 'object' || settings === null) {
		return Object.freeze({
			valid: false,
			errors: Object.freeze(['Settings must be a JSON object']),
			validSettings: Object.freeze({}),
		});
	}

	// Check for non-plain object (potential prototype pollution)
	if (Object.getPrototypeOf(settings) !== Object.prototype) {
		return Object.freeze({
			valid: false,
			errors: Object.freeze(['Settings must be a plain JSON object']),
			validSettings: Object.freeze({}),
		});
	}

	const settingsObj = settings as Record<string, unknown>;

	// Check file size (prevent DoS via huge JSON)
	const keyCount = Object.keys(settingsObj).length;
	if (keyCount > 100) {
		return Object.freeze({
			valid: false,
			errors: Object.freeze(['Settings file contains too many keys (max 100)']),
			validSettings: Object.freeze({}),
		});
	}

	// Validate each setting
	for (const [key, value] of Object.entries(settingsObj)) {
		// Prevent dangerous keys (prototype pollution)
		if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
			errors.push(`Dangerous setting key rejected: "${key}"`);
			continue;
		}

		// Check if key is allowed
		if (!(key in SETTINGS_SCHEMA)) {
			errors.push(`Unknown setting: "${key}"`);
			continue;
		}

		// Validate value
		const schema = SETTINGS_SCHEMA[key as SettingKey];
		const error = validateValue(key, value, schema);

		if (error) {
			errors.push(error);
		} else {
			validSettings[key] = value;
		}
	}

	return Object.freeze({
		valid: errors.length === 0,
		errors: Object.freeze(errors),
		validSettings: Object.freeze(validSettings),
	});
}

/**
 * Maximum allowed JSON file size for import (100KB)
 */
export const MAX_IMPORT_FILE_SIZE = 100 * 1024;

/**
 * Checks if a value is safe to import (no dangerous patterns)
 */
export function isSafeValue(value: unknown): boolean {
	// Prevent objects (only primitives allowed)
	if (typeof value === 'object' && value !== null) {
		return false;
	}

	// Prevent functions
	if (typeof value === 'function') {
		return false;
	}

	// Prevent symbols
	if (typeof value === 'symbol') {
		return false;
	}

	return true;
}

/**
 * Validates JSON file size before parsing
 */
export function validateFileSize(sizeBytes: number): string | null {
	if (sizeBytes > MAX_IMPORT_FILE_SIZE) {
		return `Settings file too large (${sizeBytes} bytes). Maximum allowed: ${MAX_IMPORT_FILE_SIZE} bytes`;
	}
	if (sizeBytes === 0) {
		return 'Settings file is empty';
	}
	return null;
}
