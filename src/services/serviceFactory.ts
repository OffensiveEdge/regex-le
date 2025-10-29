import * as vscode from 'vscode'
import type { Telemetry } from '../telemetry/telemetry'
import { createTelemetry } from '../telemetry/telemetry'
import type { Notifier } from '../ui/notifier'
import { createNotifier } from '../ui/notifier'
import type { StatusBar } from '../ui/statusBar'
import { createStatusBar } from '../ui/statusBar'
import {
  createErrorHandler,
  createErrorLogger,
  createErrorNotifier,
  type ErrorHandler,
} from '../utils/errorHandling'
import { createLocalizer, type Localizer } from '../utils/localization'
import { createPerformanceMonitor, type PerformanceMonitor } from '../utils/performance'

/**
 * Core services used throughout the extension
 */
export interface ExtensionServices {
  readonly telemetry: Telemetry
  readonly notifier: Notifier
  readonly statusBar: StatusBar
  readonly localizer: Localizer
  readonly performanceMonitor: PerformanceMonitor
  readonly errorHandler: ErrorHandler
}

/**
 * Creates all core services for the extension
 * Centralizes service initialization and dependency management
 */
export function createServices(context: vscode.ExtensionContext): ExtensionServices {
  // Create output channel for logging
  const outputChannel = vscode.window.createOutputChannel('Regex-LE')
  context.subscriptions.push(outputChannel)

  // Create core services
  const telemetry = createTelemetry()
  const notifier = createNotifier()
  const statusBar = createStatusBar(context)
  const localizer = createLocalizer()
  const performanceMonitor = createPerformanceMonitor()

  // Register disposables to prevent memory leaks
  context.subscriptions.push(telemetry)
  context.subscriptions.push(statusBar)

  // Create error handling services
  const _errorLogger = createErrorLogger()
  const _errorNotifier = createErrorNotifier()
  const errorHandler = createErrorHandler()

  return Object.freeze({
    telemetry,
    notifier,
    statusBar,
    localizer,
    performanceMonitor,
    errorHandler,
  })
}
