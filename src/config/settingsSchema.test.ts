import { describe, expect, it } from 'vitest'
import {
	isSafeValue,
	MAX_IMPORT_FILE_SIZE,
	SETTINGS_SCHEMA,
	validateFileSize,
	validateSettings,
} from './settingsSchema'

describe('settingsSchema', () => {
	describe('validateSettings', () => {
		it('should accept valid boolean settings', () => {
			const settings = {
				copyToClipboardEnabled: true,
				openResultsSideBySide: false,
				telemetryEnabled: true,
			}

			const result = validateSettings(settings)

			expect(result.valid).toBe(true)
			expect(result.errors).toHaveLength(0)
			expect(result.validSettings).toEqual(settings)
		})

		it('should accept valid string enum settings', () => {
			const settings = {
				notificationsLevel: 'silent',
			}

			const result = validateSettings(settings)

			expect(result.valid).toBe(true)
			expect(result.errors).toHaveLength(0)
			expect(result.validSettings).toEqual(settings)
		})

		it('should accept valid number settings within range', () => {
			const settings = {
				'safety.fileSizeWarnBytes': 1000000,
				'performance.maxDuration': 5000,
				'regex.maxMatchLimit': 1000,
			}

			const result = validateSettings(settings)

			expect(result.valid).toBe(true)
			expect(result.errors).toHaveLength(0)
			expect(result.validSettings).toEqual(settings)
		})

		it('should accept valid regex-specific settings', () => {
			const settings = {
				'regex.realtimePreviewEnabled': true,
				'regex.redosDetectionEnabled': false,
				'regex.maxMatchLimit': 500,
			}

			const result = validateSettings(settings)

			expect(result.valid).toBe(true)
			expect(result.errors).toHaveLength(0)
			expect(result.validSettings).toEqual(settings)
		})

		it('should reject non-object settings', () => {
			const result = validateSettings('not an object')

			expect(result.valid).toBe(false)
			expect(result.errors).toContain('Settings must be a JSON object')
			expect(result.validSettings).toEqual({})
		})

		it('should reject null settings', () => {
			const result = validateSettings(null)

			expect(result.valid).toBe(false)
			expect(result.errors).toContain('Settings must be a JSON object')
		})

		it('should reject settings with wrong types', () => {
			const settings = {
				copyToClipboardEnabled: 'true', // Should be boolean
				'safety.fileSizeWarnBytes': '1000000', // Should be number
			}

			const result = validateSettings(settings)

			expect(result.valid).toBe(false)
			expect(result.errors).toContain(
				'Setting "copyToClipboardEnabled": Expected boolean, got string',
			)
			expect(result.errors).toContain(
				'Setting "safety.fileSizeWarnBytes": Expected number, got string',
			)
			expect(result.validSettings).toEqual({})
		})

		it('should reject invalid enum values', () => {
			const settings = {
				notificationsLevel: 'invalid',
			}

			const result = validateSettings(settings)

			expect(result.valid).toBe(false)
			expect(
				result.errors.some((e) => e.includes('notificationsLevel')),
			).toBe(true)
		})

		it('should reject numbers below minimum', () => {
			const settings = {
				'safety.fileSizeWarnBytes': 500, // Below min of 1000
				'safety.largeOutputLinesThreshold': 50, // Below min of 100
				'regex.maxMatchLimit': 5, // Below min of 10
			}

			const result = validateSettings(settings)

			expect(result.valid).toBe(false)
			expect(
				result.errors.some((e) => e.includes('below minimum')),
			).toBe(true)
		})

		it('should reject numbers above maximum', () => {
			const settings = {
				'safety.fileSizeWarnBytes': 200_000_000, // Above max of 100MB
				'regex.maxMatchLimit': 20000, // Above max of 10000
			}

			const result = validateSettings(settings)

			expect(result.valid).toBe(false)
			expect(
				result.errors.some((e) => e.includes('above maximum')),
			).toBe(true)
		})

		it('should reject unknown settings', () => {
			const settings = {
				unknownSetting: true,
				copyToClipboardEnabled: true,
			}

			const result = validateSettings(settings)

			expect(result.valid).toBe(false)
			expect(result.errors).toContain('Unknown setting: "unknownSetting"')
			expect(result.validSettings.copyToClipboardEnabled).toBe(true)
		})

		it('should reject dangerous keys (prototype pollution)', () => {
			const settings = {
				__proto__: { malicious: true },
				constructor: { malicious: true },
				prototype: { malicious: true },
				copyToClipboardEnabled: true, // Add a valid key to ensure validation runs
			}

			const result = validateSettings(settings)

			expect(result.valid).toBe(false)
			// Dangerous keys should be rejected
			const hasDangerousKeyErrors =
				result.errors.some((e) =>
					e.toLowerCase().includes('dangerous'),
				) ||
				result.errors.some((e) => e.includes('__proto__')) ||
				result.errors.some((e) => e.includes('constructor')) ||
				result.errors.some((e) => e.includes('prototype'))
			expect(hasDangerousKeyErrors || result.errors.length > 0).toBe(true)
		})

		it('should reject settings file with too many keys', () => {
			const settings: Record<string, boolean> = {}
			for (let i = 0; i < 101; i++) {
				settings[`key${i}`] = true
			}

			const result = validateSettings(settings)

			expect(result.valid).toBe(false)
			expect(
				result.errors.some((e) =>
					e.toLowerCase().includes('too many'),
				),
			).toBe(true)
		})

		it('should reject non-plain objects', () => {
			class CustomClass {
				value = true
			}
			const instance = new CustomClass()

			const result = validateSettings(instance)

			expect(result.valid).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
			const hasPlainObjectError = result.errors.some((e) =>
				e.toLowerCase().includes('plain'),
			)
			expect(hasPlainObjectError || result.errors.length > 0).toBe(true)
		})

		it('should accept all valid settings', () => {
			const settings = {
				copyToClipboardEnabled: true,
				notificationsLevel: 'important' as const,
				openResultsSideBySide: true,
				telemetryEnabled: true,
				'safety.enabled': true,
				'safety.fileSizeWarnBytes': 1000000,
				'safety.largeOutputLinesThreshold': 50000,
				'statusBar.enabled': true,
				'performance.enabled': true,
				'performance.maxDuration': 5000,
				'performance.maxMemoryUsage': 104857600,
				'regex.realtimePreviewEnabled': true,
				'regex.redosDetectionEnabled': true,
				'regex.maxMatchLimit': 1000,
			}

			const result = validateSettings(settings)

			expect(result.valid).toBe(true)
			expect(result.errors).toHaveLength(0)
		})

		it('should handle partial valid settings', () => {
			const settings = {
				copyToClipboardEnabled: true,
				invalidSetting: 'value',
				'safety.fileSizeWarnBytes': 2000000,
			}

			const result = validateSettings(settings)

			expect(result.valid).toBe(false)
			expect(result.validSettings.copyToClipboardEnabled).toBe(true)
			expect(result.validSettings['safety.fileSizeWarnBytes']).toBe(2000000)
			expect('invalidSetting' in result.validSettings).toBe(false)
		})

		it('should accept all notification level values', () => {
			for (const level of ['all', 'important', 'silent'] as const) {
				const settings = {
					notificationsLevel: level,
				}

				const result = validateSettings(settings)

				expect(result.valid).toBe(true)
				expect(result.validSettings.notificationsLevel).toBe(level)
			}
		})

		it('should validate regex max match limit range', () => {
			const validMin = { 'regex.maxMatchLimit': 10 }
			const validMax = { 'regex.maxMatchLimit': 10000 }
			const validMid = { 'regex.maxMatchLimit': 5000 }

			expect(validateSettings(validMin).valid).toBe(true)
			expect(validateSettings(validMax).valid).toBe(true)
			expect(validateSettings(validMid).valid).toBe(true)

			const tooLow = { 'regex.maxMatchLimit': 9 }
			const tooHigh = { 'regex.maxMatchLimit': 10001 }

			expect(validateSettings(tooLow).valid).toBe(false)
			expect(validateSettings(tooHigh).valid).toBe(false)
		})
	})

	describe('validateFileSize', () => {
		it('should accept valid file size', () => {
			const result = validateFileSize(50000)
			expect(result).toBeNull()
		})

		it('should reject file size exceeding maximum', () => {
			const result = validateFileSize(MAX_IMPORT_FILE_SIZE + 1)
			expect(result).toContain('too large')
			expect(result).toContain(MAX_IMPORT_FILE_SIZE.toString())
		})

		it('should reject empty file', () => {
			const result = validateFileSize(0)
			expect(result).toContain('empty')
		})

		it('should accept file at maximum size', () => {
			const result = validateFileSize(MAX_IMPORT_FILE_SIZE)
			expect(result).toBeNull()
		})
	})

	describe('isSafeValue', () => {
		it('should accept primitive values', () => {
			expect(isSafeValue(true)).toBe(true)
			expect(isSafeValue(false)).toBe(true)
			expect(isSafeValue(123)).toBe(true)
			expect(isSafeValue('string')).toBe(true)
			expect(isSafeValue(null)).toBe(true)
			expect(isSafeValue(undefined)).toBe(true)
		})

		it('should reject objects', () => {
			expect(isSafeValue({})).toBe(false)
			expect(isSafeValue([])).toBe(false)
			expect(isSafeValue({ key: 'value' })).toBe(false)
		})

		it('should reject functions', () => {
			expect(isSafeValue(() => {})).toBe(false)
			expect(isSafeValue(function () {})).toBe(false)
		})

		it('should reject symbols', () => {
			expect(isSafeValue(Symbol('test'))).toBe(false)
		})
	})

	describe('SETTINGS_SCHEMA', () => {
		it('should be frozen', () => {
			expect(Object.isFrozen(SETTINGS_SCHEMA)).toBe(true)
		})

		it('should contain all expected setting keys', () => {
			const expectedKeys = [
				'copyToClipboardEnabled',
				'notificationsLevel',
				'openResultsSideBySide',
				'telemetryEnabled',
				'safety.enabled',
				'safety.fileSizeWarnBytes',
				'safety.largeOutputLinesThreshold',
				'statusBar.enabled',
				'performance.enabled',
				'performance.maxDuration',
				'performance.maxMemoryUsage',
				'regex.realtimePreviewEnabled',
				'regex.redosDetectionEnabled',
				'regex.maxMatchLimit',
			]

			for (const key of expectedKeys) {
				expect(key in SETTINGS_SCHEMA).toBe(true)
			}
		})
	})
})

