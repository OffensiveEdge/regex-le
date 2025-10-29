import * as vscode from 'vscode'
import type { Telemetry } from '../telemetry/telemetry'

/**
 * Register command to open extension settings
 */
export function registerOpenSettingsCommand(
  context: vscode.ExtensionContext,
  telemetry: Telemetry,
): void {
  const disposable = vscode.commands.registerCommand('regex-le.openSettings', async () => {
    telemetry.event('settings-opened')
    await vscode.commands.executeCommand(
      'workbench.action.openSettings',
      '@ext:nolindnaidoo.regex-le',
    )
  })

  context.subscriptions.push(disposable)
}
