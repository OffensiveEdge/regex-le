import type * as vscode from 'vscode'
import type { Telemetry } from '../telemetry/telemetry'
import type { Notifier } from '../ui/notifier'
import type { StatusBar } from '../ui/statusBar'
import type { PerformanceMonitor } from '../utils/performance'
import { registerExtractCommand } from './extract'
import { registerHelpCommand } from './help'
import { registerTestCommand } from './test'
import { registerValidateCommand } from './validate'

export function registerCommands(
  context: vscode.ExtensionContext,
  deps: Readonly<{
    telemetry: Telemetry
    notifier: Notifier
    statusBar: StatusBar
    performanceMonitor: PerformanceMonitor
  }>,
): void {
  registerTestCommand(context, deps)
  registerExtractCommand(context, deps)
  registerValidateCommand(context, deps)
  registerHelpCommand(context, deps.telemetry)
}
