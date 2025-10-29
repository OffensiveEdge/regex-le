import * as vscode from 'vscode'
import * as nls from 'vscode-nls'
import { getConfiguration } from '../config/config'
import { estimatePatternComplexity } from '../extraction/regex/performance'
import { detectReDoS } from '../extraction/regex/redos'
import type { Telemetry } from '../telemetry/telemetry'
import type { Notifier } from '../ui/notifier'
import type { StatusBar } from '../ui/statusBar'

const localize = nls.config({ messageFormat: nls.MessageFormat.file })()

/**
 * Register the regex validate command
 * Validates a regex pattern and checks for ReDoS vulnerabilities
 */
export function registerValidateCommand(
  context: vscode.ExtensionContext,
  deps: Readonly<{
    telemetry: Telemetry
    notifier: Notifier
    statusBar: StatusBar
  }>,
): void {
  const disposable = vscode.commands.registerCommand('regex-le.validate', async () => {
    deps.telemetry.event('command-validate')

    // Ask for regex pattern
    const patternInput = await vscode.window.showInputBox({
      prompt: localize('runtime.validate.pattern.prompt', 'Enter regex pattern to validate'),
      placeHolder: localize('runtime.validate.pattern.placeholder', 'e.g., /\\d+/'),
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return localize('runtime.validate.pattern.invalid', 'Pattern cannot be empty')
        }
        return null
      },
    })

    if (!patternInput) {
      return
    }

    // Extract pattern and flags
    const patternMatch = patternInput.match(/^\/(.+)\/([gimsuvy]*)$/)
    let pattern: string
    let flags: string

    if (patternMatch) {
      pattern = patternMatch[1] || ''
      flags = patternMatch[2] || ''
    } else {
      pattern = patternInput.trim()
      flags = ''
    }

    try {
      // Validate syntax
      let isValid = false
      let syntaxError: string | undefined
      try {
        new RegExp(pattern, flags)
        isValid = true
      } catch (error) {
        syntaxError = error instanceof Error ? error.message : String(error)
      }

      const config = getConfiguration()

      // Check for ReDoS
      let redosResult
      if (config.regexRedosDetectionEnabled) {
        redosResult = detectReDoS(pattern, flags)
      } else {
        redosResult = { detected: false, severity: 'low' as const, reason: '' }
      }

      // Estimate complexity
      const complexity = estimatePatternComplexity(pattern)

      // Calculate performance score (simplified)
      const performanceScore = isValid ? 100 - complexity.score : 0

      // Build validation report
      const reportLines: string[] = []
      reportLines.push('# Regex Validation Results')
      reportLines.push('')
      reportLines.push(`**Pattern:** \`/${pattern}/${flags}\``)
      reportLines.push('')

      if (isValid) {
        reportLines.push('**Status:** ✅ Valid')
        reportLines.push('')
      } else {
        reportLines.push('**Status:** ❌ Invalid')
        if (syntaxError) {
          reportLines.push(`**Error:** ${syntaxError}`)
        }
        reportLines.push('')
      }

      if (redosResult.detected) {
        reportLines.push('## ⚠️ ReDoS Detection')
        reportLines.push(`**Detected:** Yes`)
        reportLines.push(`**Severity:** ${redosResult.severity}`)
        reportLines.push(`**Reason:** ${redosResult.reason}`)
        reportLines.push('')
      } else {
        reportLines.push('## ✅ ReDoS Detection')
        reportLines.push('**Detected:** No vulnerabilities found')
        reportLines.push('')
      }

      reportLines.push('## Performance Analysis')
      reportLines.push(`**Complexity Score:** ${complexity.score}/100`)
      reportLines.push(`**Performance Score:** ${performanceScore}/100`)
      if (complexity.factors.length > 0) {
        reportLines.push('')
        reportLines.push('**Complexity Factors:**')
        for (const factor of complexity.factors) {
          reportLines.push(`- ${factor}`)
        }
      }
      reportLines.push('')

      if (isValid && !redosResult.detected && performanceScore >= 70) {
        reportLines.push('## ✅ Recommendation')
        reportLines.push('This pattern is safe to use and performs well.')
      } else if (isValid && redosResult.detected) {
        reportLines.push('## ⚠️ Recommendation')
        reportLines.push(
          'This pattern is valid but may be vulnerable to ReDoS attacks. Consider refactoring.',
        )
      } else if (isValid && performanceScore < 70) {
        reportLines.push('## ⚠️ Recommendation')
        reportLines.push(
          'This pattern is valid but may have performance issues. Consider optimization.',
        )
      } else {
        reportLines.push('## ❌ Recommendation')
        reportLines.push('This pattern has syntax errors and cannot be used.')
      }

      const report = reportLines.join('\n')

      // Copy to clipboard if enabled
      if (config.copyToClipboardEnabled) {
        await vscode.env.clipboard.writeText(report)
      }

      // Open result document
      const doc = await vscode.workspace.openTextDocument({
        content: report,
        language: 'markdown',
      })

      const viewColumn = config.openResultsSideBySide
        ? vscode.ViewColumn.Beside
        : vscode.ViewColumn.Active

      await vscode.window.showTextDocument(doc, viewColumn)

      deps.telemetry.event('validate-completed', {
        valid: isValid,
        redosDetected: redosResult.detected,
        performanceScore,
      })

      if (config.notificationsLevel === 'all') {
        const statusMessage = isValid
          ? localize('runtime.validate.valid', 'Pattern is valid')
          : localize(
              'runtime.validate.invalid',
              'Pattern is invalid: {0}',
              syntaxError || 'Unknown error',
            )

        deps.notifier.showInfo(statusMessage)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      deps.notifier.showError(
        localize('runtime.validate.error', 'Validation failed: {0}', errorMessage),
      )
      deps.telemetry.event('validate-failed', { error: errorMessage })
    }
  })

  context.subscriptions.push(disposable)
}
