import * as vscode from 'vscode'
import * as nls from 'vscode-nls'
import type { Configuration } from '../types'
import { createEnhancedError, type EnhancedError } from './errorHandling'

const localize = nls.config({ messageFormat: nls.MessageFormat.file })()

export interface SafetyResult {
  readonly proceed: boolean
  readonly message: string
  readonly error?: EnhancedError
  readonly warnings: readonly string[]
}

export interface SafetyCheckOptions {
  readonly showProgress?: boolean
  readonly allowOverride?: boolean
  readonly customThresholds?: {
    readonly fileSizeBytes?: number
    readonly lineCount?: number
    readonly itemCount?: number
  }
}

/**
 * Perform safety checks on a document before processing
 */
export function handleSafetyChecks(
  document: vscode.TextDocument,
  config: Configuration,
  options: SafetyCheckOptions = {},
): SafetyResult {
  // Skip safety checks if disabled
  if (!config.safetyEnabled) {
    return Object.freeze({
      proceed: true,
      message: '',
      warnings: Object.freeze([]),
    })
  }

  const content = document.getText()
  const fileSizeThreshold =
    options.customThresholds?.fileSizeBytes ?? config.safetyFileSizeWarnBytes

  // Check file size
  const exceedsFileSize = content.length > fileSizeThreshold
  if (exceedsFileSize) {
    const error = createEnhancedError(
      new Error(
        localize(
          'runtime.safety.file-size',
          'File size ({0} bytes) exceeds safety threshold ({1} bytes)',
          content.length,
          fileSizeThreshold,
        ),
      ),
      'safety',
      {
        fileSize: content.length,
        threshold: fileSizeThreshold,
        fileName: document.fileName,
      },
      {
        recoverable: false,
        severity: 'high',
        suggestion: localize(
          'runtime.safety.file-size.suggestion',
          'Consider splitting the file or increasing the safety threshold in settings',
        ),
      },
    )

    return Object.freeze({
      proceed: false,
      message: error.userMessage,
      error,
      warnings: Object.freeze([]),
    })
  }

  // Collect warnings
  const warnings = collectSafetyWarnings(content, config, options)
  const hasWarnings = warnings.length > 0
  const message = hasWarnings
    ? localize('runtime.safety.warnings', 'Safety checks passed with {0} warnings', warnings.length)
    : localize('runtime.safety.passed', 'Safety checks passed')

  return Object.freeze({
    proceed: true,
    message,
    warnings: Object.freeze(warnings),
  })
}

/**
 * Collect safety warnings without blocking
 */
function collectSafetyWarnings(
  content: string,
  _config: Configuration,
  options: SafetyCheckOptions,
): string[] {
  const warnings: string[] = []
  const lines = content.split('\n')
  const lineCount = lines.length

  // Warn about large line count
  const lineThreshold = options.customThresholds?.lineCount ?? 10000
  if (lineCount > lineThreshold) {
    warnings.push(
      localize(
        'runtime.safety.line-count.warning',
        'File has {0} lines (threshold: {1})',
        lineCount,
        lineThreshold,
      ),
    )
  }

  // Warn if file appears to be binary or malformed
  const hasBinaryContent = content.includes('\x00')
  if (hasBinaryContent) {
    warnings.push(localize('runtime.safety.binary.warning', 'File may contain binary content'))
  }

  return warnings
}

/**
 * Check output safety before presenting to user
 */
export function checkOutputSafety(
  outputLines: readonly string[],
  config: Configuration,
): SafetyResult {
  if (!config.safetyEnabled) {
    return Object.freeze({
      proceed: true,
      message: '',
      warnings: Object.freeze([]),
    })
  }

  const lineCount = outputLines.length
  const threshold = config.safetyLargeOutputLinesThreshold

  // Block extremely large outputs
  const exceedsThreshold = lineCount > threshold
  if (exceedsThreshold) {
    const error = createEnhancedError(
      new Error(
        localize(
          'runtime.safety.output-size',
          'Output size ({0} lines) exceeds safety threshold ({1} lines)',
          lineCount,
          threshold,
        ),
      ),
      'safety',
      {
        outputLines: lineCount,
        threshold,
      },
      {
        recoverable: true,
        severity: 'medium',
        suggestion: localize(
          'runtime.safety.output-size.suggestion',
          'Consider filtering results or increasing the threshold',
        ),
      },
    )

    return Object.freeze({
      proceed: false,
      message: error.userMessage,
      error,
      warnings: Object.freeze([]),
    })
  }

  return Object.freeze({
    proceed: true,
    message: localize('runtime.safety.output.passed', 'Output safety check passed'),
    warnings: Object.freeze([]),
  })
}

/**
 * Ask user for confirmation when processing risky operations
 */
export async function confirmRiskyOperation(message: string, detail?: string): Promise<boolean> {
  const proceed = localize('runtime.safety.confirm.proceed', 'Proceed')
  const cancel = localize('runtime.safety.confirm.cancel', 'Cancel')

  const options = detail !== undefined ? { modal: true, detail } : { modal: true }
  const result = await vscode.window.showWarningMessage(message, options, proceed, cancel)

  return result === proceed
}
