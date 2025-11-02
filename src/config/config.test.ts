import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';
import { getConfiguration } from './config';

// Mock vscode module
vi.mock('vscode');

describe('config', () => {
	const mockConfig = {
		get: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(vscode.workspace.getConfiguration).mockReturnValue(
			mockConfig as any,
		);

		// Set default return values for regex-le settings
		mockConfig.get.mockImplementation((key: string, defaultValue: unknown) => {
			// Return defaults for common keys
			const defaults: Record<string, unknown> = {
				copyToClipboardEnabled: false,
				notificationsLevel: 'silent',
				openResultsSideBySide: true,
				'safety.enabled': true,
				'safety.fileSizeWarnBytes': 1000000,
				'safety.largeOutputLinesThreshold': 50000,
				'statusBar.enabled': true,
				telemetryEnabled: false,
				'performance.enabled': true,
				'performance.maxDuration': 5000,
				'performance.maxMemoryUsage': 104857600,
				'regex.realtimePreviewEnabled': true,
				'regex.redosDetectionEnabled': true,
				'regex.maxMatchLimit': 1000,
			};
			return defaults[key] ?? defaultValue;
		});
	});

	describe('getConfiguration', () => {
		it('should return frozen configuration object', () => {
			const config = getConfiguration();
			expect(Object.isFrozen(config)).toBe(true);
		});

		it('should read boolean settings', () => {
			mockConfig.get.mockImplementation((key: string) => {
				if (key === 'copyToClipboardEnabled') return true;
				return undefined;
			});

			const config = getConfiguration();
			expect(config.copyToClipboardEnabled).toBe(true);
		});

		it('should use defaults for missing settings', () => {
			const config = getConfiguration();
			expect(config.copyToClipboardEnabled).toBe(false);
			expect(config.openResultsSideBySide).toBe(true);
			expect(config.safetyEnabled).toBe(true);
		});

		it('should validate notification level', () => {
			mockConfig.get.mockImplementation((key: string) => {
				if (key === 'notificationsLevel') return 'all';
				return undefined;
			});

			const config = getConfiguration();
			expect(config.notificationsLevel).toBe('all');
		});

		it('should default to silent for invalid notification level', () => {
			mockConfig.get.mockImplementation((key: string) => {
				if (key === 'notificationsLevel') return 'invalid';
				return undefined;
			});

			const config = getConfiguration();
			expect(config.notificationsLevel).toBe('silent');
		});

		it('should enforce minimum values for numeric settings', () => {
			mockConfig.get.mockImplementation((key: string) => {
				if (key === 'safety.fileSizeWarnBytes') return 500; // Below min of 1000
				if (key === 'safety.largeOutputLinesThreshold') return 50; // Below min of 100
				if (key === 'performance.maxDuration') return 500; // Below min of 1000
				if (key === 'performance.maxMemoryUsage') return 500000; // Below min of 1MB
				if (key === 'regex.maxMatchLimit') return 5; // Below min of 10
				return undefined;
			});

			const config = getConfiguration();
			expect(config.safetyFileSizeWarnBytes).toBeGreaterThanOrEqual(1000);
			expect(config.safetyLargeOutputLinesThreshold).toBeGreaterThanOrEqual(
				100,
			);
			expect(config.performanceMaxDuration).toBeGreaterThanOrEqual(1000);
			expect(config.performanceMaxMemoryUsage).toBeGreaterThanOrEqual(1048576);
			expect(config.regexMaxMatchLimit).toBeGreaterThanOrEqual(10);
		});

		it('should enforce maximum value for regex max match limit', () => {
			mockConfig.get.mockImplementation((key: string) => {
				if (key === 'regex.maxMatchLimit') return 20000; // Above max of 10000
				return undefined;
			});

			const config = getConfiguration();
			expect(config.regexMaxMatchLimit).toBeLessThanOrEqual(10000);
		});

		it('should read all configuration properties', () => {
			const config = getConfiguration();

			expect(config).toHaveProperty('copyToClipboardEnabled');
			expect(config).toHaveProperty('notificationsLevel');
			expect(config).toHaveProperty('openResultsSideBySide');
			expect(config).toHaveProperty('safetyEnabled');
			expect(config).toHaveProperty('safetyFileSizeWarnBytes');
			expect(config).toHaveProperty('safetyLargeOutputLinesThreshold');
			expect(config).toHaveProperty('statusBarEnabled');
			expect(config).toHaveProperty('telemetryEnabled');
			expect(config).toHaveProperty('performanceEnabled');
			expect(config).toHaveProperty('performanceMaxDuration');
			expect(config).toHaveProperty('performanceMaxMemoryUsage');
			expect(config).toHaveProperty('regexRealtimePreviewEnabled');
			expect(config).toHaveProperty('regexRedosDetectionEnabled');
			expect(config).toHaveProperty('regexMaxMatchLimit');
		});

		it('should handle regex-specific settings', () => {
			mockConfig.get.mockImplementation((key: string) => {
				if (key === 'regex.realtimePreviewEnabled') return false;
				if (key === 'regex.redosDetectionEnabled') return false;
				if (key === 'regex.maxMatchLimit') return 500;
				return undefined;
			});

			const config = getConfiguration();
			expect(config.regexRealtimePreviewEnabled).toBe(false);
			expect(config.regexRedosDetectionEnabled).toBe(false);
			expect(config.regexMaxMatchLimit).toBe(500);
		});

		it('should handle all notification levels', () => {
			for (const level of ['all', 'important', 'silent'] as const) {
				mockConfig.get.mockImplementation((key: string) => {
					if (key === 'notificationsLevel') return level;
					return undefined;
				});

				const config = getConfiguration();
				expect(config.notificationsLevel).toBe(level);
			}
		});
	});
});
