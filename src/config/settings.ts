import * as vscode from 'vscode'
import * as nls from 'vscode-nls'
import type { Telemetry } from '../telemetry/telemetry'
import { getConfiguration } from './config'
import {
	type ValidationResult,
	validateFileSize,
	validateSettings,
} from './settingsSchema'

const localize = nls.config({ messageFormat: nls.MessageFormat.file })()

/**
 * Register command to open extension settings
 */
export function registerOpenSettingsCommand(
	context: vscode.ExtensionContext,
	telemetry: Telemetry,
): void {
	const command = vscode.commands.registerCommand(
		'regex-le.openSettings',
		async () => {
			telemetry.event('command-open-settings');
			await vscode.commands.executeCommand(
				'workbench.action.openSettings',
				'regex-le',
			);
		},
	);

	context.subscriptions.push(command);
}

/**
 * Register command to export settings
 */
export function registerExportSettingsCommand(
	context: vscode.ExtensionContext,
	telemetry: Telemetry,
): void {
	const command = vscode.commands.registerCommand(
		'regex-le.settings.export',
		async () => {
			telemetry.event('command-settings-export');

			try {
				const workspaceConfig = vscode.workspace.getConfiguration('regex-le');
				// Export raw settings with dotted keys to match schema
				const rawSettings: Record<string, unknown> = {};
				
				// Copy all settings from workspace config
				for (const key of [
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
				] as const) {
					const value = workspaceConfig.get(key);
					if (value !== undefined) {
						rawSettings[key] = value;
					}
				}
				
				const exportData = {
					version: '1.8.0',
					exportDate: new Date().toISOString(),
					settings: rawSettings,
				};
				const configJson = JSON.stringify(exportData, null, 2);

				const uri = await vscode.window.showSaveDialog({
					filters: { JSON: ['json'] },
					defaultUri: vscode.Uri.file('regex-le-settings.json'),
				});

				if (uri) {
					await vscode.workspace.fs.writeFile(
						uri,
						Buffer.from(configJson, 'utf8'),
					);

					vscode.window.showInformationMessage(
						localize(
							'runtime.settings.export.success',
							'Settings exported successfully',
						),
					);
				}
			} catch (error) {
				vscode.window.showErrorMessage(
					localize(
						'runtime.settings.export.error',
						'Failed to export settings: {0}',
						error instanceof Error ? error.message : String(error),
					),
				);
			}
		},
	);

	context.subscriptions.push(command);
}

/**
 * Register command to import settings
 */
export function registerImportSettingsCommand(
	context: vscode.ExtensionContext,
	telemetry: Telemetry,
): void {
	const command = vscode.commands.registerCommand(
		'regex-le.settings.import',
		async () => {
			telemetry.event('command-settings-import');

			try {
				// Show file picker
				const uri = await vscode.window.showOpenDialog({
					filters: { JSON: ['json'] },
					canSelectMany: false,
					title: localize(
						'runtime.settings.import.title',
						'Import Regex-LE Settings',
					),
				});

				if (!uri || uri.length === 0 || !uri[0]) {
					return;
				}

				// Get file stats to check size before reading
				const stats = await vscode.workspace.fs.stat(uri[0]);
				const fileSizeError = validateFileSize(stats.size);

				if (fileSizeError) {
					telemetry.event('settings-import-rejected-size', {
						size: stats.size.toString(),
					});
					vscode.window.showErrorMessage(
						localize(
							'runtime.settings.import.size-error',
							'Cannot import settings: {0}',
							fileSizeError,
						),
					);
					return;
				}

				// Read and parse file
				const fileContent = await vscode.workspace.fs.readFile(uri[0]);
				const configJson = Buffer.from(fileContent).toString('utf8');

				let parsedSettings: unknown;
				try {
					const parsed = JSON.parse(configJson);
					// Handle wrapped format with version/exportDate
					parsedSettings =
						parsed && typeof parsed === 'object' && 'settings' in parsed
							? parsed.settings
							: parsed;
				} catch (parseError) {
					telemetry.event('settings-import-parse-error');
					vscode.window.showErrorMessage(
						localize(
							'runtime.settings.import.parse-error',
							'Invalid JSON file: {0}',
							parseError instanceof Error ? parseError.message : 'Parse error',
						),
					);
					return;
				}

				// Validate settings against schema
				const validation: ValidationResult = validateSettings(parsedSettings);

				if (!validation.valid) {
					telemetry.event('settings-import-validation-failed', {
						errorCount: validation.errors.length.toString(),
					});

					// Show detailed validation errors
					const errorMessage = [
						localize(
							'runtime.settings.import.validation-failed',
							'Settings validation failed:',
						),
						'',
						...validation.errors.slice(0, 10), // Limit to first 10 errors
					].join('\n');

					const viewDetails = await vscode.window.showErrorMessage(
						localize(
							'runtime.settings.import.validation-title',
							'Cannot import settings due to validation errors',
						),
						localize('runtime.settings.import.view-details', 'View Details'),
					);

					if (
						viewDetails ===
						localize('runtime.settings.import.view-details', 'View Details')
					) {
						const doc = await vscode.workspace.openTextDocument({
							content: errorMessage,
							language: 'plaintext',
						});
						await vscode.window.showTextDocument(doc);
					}

					return;
				}

				// Show confirmation if there were warnings (some settings skipped)
				const validCount = Object.keys(validation.validSettings).length;
				const totalCount =
					parsedSettings &&
					typeof parsedSettings === 'object' &&
					parsedSettings !== null
						? Object.keys(parsedSettings).length
						: 0;
				const skippedCount = totalCount - validCount;

				if (skippedCount > 0) {
					const proceed = await vscode.window.showWarningMessage(
						localize(
							'runtime.settings.import.partial-warning',
							'{0} invalid setting(s) will be skipped. Import {1} valid setting(s)?',
							skippedCount,
							validCount,
						),
						{ modal: true },
						localize(
							'runtime.settings.import.confirm',
							'Import Valid Settings',
						),
						localize('runtime.confirmation.cancel', 'Cancel'),
					);

					if (
						proceed !==
						localize('runtime.settings.import.confirm', 'Import Valid Settings')
					) {
						telemetry.event('settings-import-cancelled');
						return;
					}
				}

				// Import validated settings
				const workspaceConfig = vscode.workspace.getConfiguration('regex-le');
				let importedCount = 0;

				for (const [key, value] of Object.entries(validation.validSettings)) {
					try {
						await workspaceConfig.update(
							key,
							value,
							vscode.ConfigurationTarget.Global,
						);
						importedCount++;
					} catch (updateError) {
						// Log but continue with other settings
						console.error(`Failed to update setting "${key}":`, updateError);
					}
				}

				// Show success message
				telemetry.event('settings-import-success', {
					count: importedCount.toString(),
					skipped: skippedCount.toString(),
				});

				if (skippedCount > 0) {
					vscode.window.showInformationMessage(
						localize(
							'runtime.settings.import.success-partial',
							'Imported {0} setting(s) successfully ({1} invalid setting(s) skipped)',
							importedCount,
							skippedCount,
						),
					);
				} else {
					vscode.window.showInformationMessage(
						localize(
							'runtime.settings.import.success',
							'Imported {0} setting(s) successfully',
							importedCount,
						),
					);
				}
			} catch (error) {
				telemetry.event('settings-import-error');
				vscode.window.showErrorMessage(
					localize(
						'runtime.settings.import.error',
						'Failed to import settings: {0}',
						error instanceof Error ? error.message : 'Unknown error',
					),
				);
			}
		},
	);

	context.subscriptions.push(command);
}

/**
 * Register command to reset settings
 */
export function registerResetSettingsCommand(
	context: vscode.ExtensionContext,
	telemetry: Telemetry,
): void {
	const command = vscode.commands.registerCommand(
		'regex-le.settings.reset',
		async () => {
			telemetry.event('command-settings-reset');

			const confirm = await vscode.window.showWarningMessage(
				localize(
					'runtime.settings.reset.confirm',
					'Are you sure you want to reset all Regex-LE settings to defaults?',
				),
				{ modal: true },
				localize('runtime.settings.reset.confirm-yes', 'Reset Settings'),
				localize('runtime.confirmation.cancel', 'Cancel'),
			);

			if (
				confirm ===
				localize('runtime.settings.reset.confirm-yes', 'Reset Settings')
			) {
				try {
					const workspaceConfig =
						vscode.workspace.getConfiguration('regex-le');
					await workspaceConfig.update(
						'',
						undefined,
						vscode.ConfigurationTarget.Global,
					);
					vscode.window.showInformationMessage(
						localize(
							'runtime.settings.reset.success',
							'Settings reset to defaults',
						),
					);
				} catch (error) {
					vscode.window.showErrorMessage(
						localize(
							'runtime.settings.reset.error',
							'Failed to reset settings: {0}',
							error instanceof Error ? error.message : String(error),
						),
					);
				}
			}
		},
	);

	context.subscriptions.push(command);
}
