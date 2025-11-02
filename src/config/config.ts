import * as vscode from 'vscode';
import type { Configuration } from '../types';

/**
 * Get extension configuration with validation and defaults
 */
export function getConfiguration(): Configuration {
	const config = vscode.workspace.getConfiguration('regex-le');

	// Validate notification level
	const notifRaw = config.get(
		'notificationsLevel',
		'silent',
	) as unknown as string;
	const notificationsLevel = isValidNotificationLevel(notifRaw)
		? notifRaw
		: 'silent';

	return Object.freeze({
		copyToClipboardEnabled: Boolean(
			config.get('copyToClipboardEnabled', false),
		),
		notificationsLevel,
		openResultsSideBySide: Boolean(config.get('openResultsSideBySide', true)),
		safetyEnabled: Boolean(config.get('safety.enabled', true)),
		safetyFileSizeWarnBytes: Math.max(
			1000,
			Number(config.get('safety.fileSizeWarnBytes', 1000000)),
		),
		safetyLargeOutputLinesThreshold: Math.max(
			100,
			Number(config.get('safety.largeOutputLinesThreshold', 50000)),
		),
		statusBarEnabled: Boolean(config.get('statusBar.enabled', true)),
		telemetryEnabled: Boolean(config.get('telemetryEnabled', false)),
		performanceEnabled: Boolean(config.get('performance.enabled', true)),
		performanceMaxDuration: Math.max(
			1000,
			Number(config.get('performance.maxDuration', 5000)),
		),
		performanceMaxMemoryUsage: Math.max(
			1048576,
			Number(config.get('performance.maxMemoryUsage', 104857600)),
		),
		regexRealtimePreviewEnabled: Boolean(
			config.get('regex.realtimePreviewEnabled', true),
		),
		regexRedosDetectionEnabled: Boolean(
			config.get('regex.redosDetectionEnabled', true),
		),
		regexMaxMatchLimit: Math.max(
			10,
			Math.min(10000, Number(config.get('regex.maxMatchLimit', 1000))),
		),
	});
}

export type NotificationLevel = 'all' | 'important' | 'silent';

function isValidNotificationLevel(v: unknown): v is NotificationLevel {
	return v === 'all' || v === 'important' || v === 'silent';
}
