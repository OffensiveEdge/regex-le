import * as vscode from 'vscode'
import * as nls from 'vscode-nls'
import { getConfiguration } from '../config/config'
import { calculatePerformanceScore } from '../extraction/regex/performance'
import { detectReDoS } from '../extraction/regex/redos'
import { testRegexWithPerformance } from '../extraction/regex/regexTest'
import type { Telemetry } from '../telemetry/telemetry'
import type { Notifier } from '../ui/notifier'
import type { StatusBar } from '../ui/statusBar'
import type { PerformanceMonitor } from '../utils/performance'
import { handleSafetyChecks } from '../utils/safety'

const localize = nls.config({ messageFormat: nls.MessageFormat.file })()

/**
 * Register the regex test command
 * Tests a regex pattern against the active editor content
 */
export function registerTestCommand(
  context: vscode.ExtensionContext,
  deps: Readonly<{
    telemetry: Telemetry
    notifier: Notifier
    statusBar: StatusBar
    performanceMonitor: PerformanceMonitor
  }>,
): void {
  const disposable = vscode.commands.registerCommand('regex-le.test', async () => {
    deps.telemetry.event('command-test')

    const editor = vscode.window.activeTextEditor
    if (!editor) {
      deps.notifier.showWarning(
        localize('runtime.test.no-editor', 'No active editor. Please open a file first.'),
      )
      return
    }

    const config = getConfiguration()
    const document = editor.document

    // Perform safety checks
    const safetyResult = handleSafetyChecks(document, config)
    if (!safetyResult.proceed) {
      if (safetyResult.error) {
        await deps.notifier.showEnhancedError(safetyResult.error)
      } else {
        deps.notifier.showError(safetyResult.message)
      }
      return
    }

    // Ask for regex pattern
    const patternInput = await vscode.window.showInputBox({
      prompt: localize('runtime.test.pattern.prompt', 'Enter regex pattern'),
      placeHolder: localize('runtime.test.pattern.placeholder', 'e.g., /\\d+/'),
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return localize('runtime.test.pattern.invalid', 'Pattern cannot be empty')
        }
        return null
      },
    })

    if (!patternInput) {
      return
    }

    // Extract pattern and flags from input
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

    // Ask for flags if not provided
    if (!flags) {
      const flagsInput = await vscode.window.showQuickPick(
        [
          { label: 'None', value: '' },
          { label: 'Global (g)', value: 'g' },
          { label: 'Case Insensitive (i)', value: 'i' },
          { label: 'Multiline (m)', value: 'm' },
          { label: 'Dot All (s)', value: 's' },
          { label: 'Unicode (u)', value: 'u' },
          { label: 'Sticky (y)', value: 'y' },
        ],
        {
          placeHolder: localize('runtime.test.flags.prompt', 'Select regex flags (optional)'),
          canPickMany: true,
        },
      )

      if (flagsInput !== undefined) {
        flags = Array.isArray(flagsInput)
          ? flagsInput.map((f) => f.value).join('')
          : flagsInput.value
      }
    }

    try {
      const text = document.getText()
      const startTime = performance.now()

      // Check for ReDoS if enabled
      let redosResult
      if (config.regexRedosDetectionEnabled) {
        redosResult = detectReDoS(pattern, flags)
        if (redosResult.detected && redosResult.severity === 'high') {
          const proceed = await vscode.window.showWarningMessage(
            localize(
              'runtime.test.redos.warning',
              'ReDoS vulnerability detected: {0}. Continue?',
              redosResult.reason,
            ),
            { modal: true },
            localize('runtime.test.redos.proceed', 'Proceed'),
            localize('runtime.test.redos.cancel', 'Cancel'),
          )

          if (proceed !== localize('runtime.test.redos.proceed', 'Proceed')) {
            return
          }
        }
      } else {
        redosResult = { detected: false, severity: 'low' as const, reason: '' }
      }

      const result = await deps.notifier.showProgress(
        localize('runtime.test.progress', 'Testing regex pattern...'),
        async (progress, _token) => {
          progress.report({ message: 'Matching pattern...', increment: 50 })

          const testResult = testRegexWithPerformance(
            pattern,
            flags,
            text,
            config.regexMaxMatchLimit,
            startTime,
          )

          progress.report({ message: 'Calculating performance...', increment: 50 })

          let performanceScore
          if (testResult.performance) {
            performanceScore = calculatePerformanceScore(testResult.performance, text.length)
          }

          // Build result report
          const reportLines: string[] = []
          reportLines.push(`# Regex Test Results`)
          reportLines.push('')
          reportLines.push(`**Pattern:** \`/${pattern}/${flags}\``)
          reportLines.push('')

          if (testResult.success) {
            reportLines.push(`**Status:** ✅ Success`)
            reportLines.push(`**Matches Found:** ${testResult.matches.length}`)
            reportLines.push('')

            if (testResult.matches.length > 0) {
              reportLines.push('## Matches')
              reportLines.push('')

              const maxMatchesToShow = Math.min(testResult.matches.length, 100)
              for (let i = 0; i < maxMatchesToShow; i++) {
                const match = testResult.matches[i]
                if (match) {
                  reportLines.push(`${i + 1}. \`${match.match}\` at position ${match.index}`)
                  if (match.line !== undefined) {
                    reportLines.push(`   Line ${match.line}, Column ${match.column || 0}`)
                  }
                }
              }

              if (testResult.matches.length > maxMatchesToShow) {
                reportLines.push(
                  `\n... and ${testResult.matches.length - maxMatchesToShow} more matches`,
                )
              }
            }
          } else {
            reportLines.push(`**Status:** ❌ Failed`)
            if (testResult.errors.length > 0) {
              reportLines.push('')
              reportLines.push('## Errors')
              for (const error of testResult.errors) {
                reportLines.push(`- ${error.message}`)
              }
            }
          }

          if (redosResult.detected) {
            reportLines.push('')
            reportLines.push(`## ⚠️ ReDoS Detection`)
            reportLines.push(`**Severity:** ${redosResult.severity}`)
            reportLines.push(`**Reason:** ${redosResult.reason}`)
          }

          if (performanceScore) {
            reportLines.push('')
            reportLines.push('## Performance Score')
            reportLines.push(`**Overall:** ${performanceScore.overall}/100`)
            reportLines.push(`**Complexity:** ${performanceScore.complexity}/100`)
            reportLines.push(`**Execution Time:** ${performanceScore.executionTime}/100`)
            reportLines.push(`**Memory Usage:** ${performanceScore.memoryUsage}/100`)
            reportLines.push(`**Description:** ${performanceScore.description}`)
          }

          if (testResult.performance) {
            reportLines.push('')
            reportLines.push('## Performance Metrics')
            reportLines.push(`**Duration:** ${testResult.performance.duration.toFixed(2)}ms`)
            reportLines.push(`**Input Size:** ${testResult.performance.inputSize} characters`)
            reportLines.push(`**Matches:** ${testResult.performance.itemCount}`)
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

          deps.telemetry.event('test-completed', {
            success: testResult.success,
            matchCount: testResult.matches.length,
            redosDetected: redosResult.detected,
          })

          if (config.notificationsLevel === 'all') {
            deps.notifier.showInfo(
              localize('runtime.test.complete', 'Found {0} matches', testResult.matches.length),
            )
          }
        },
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      deps.notifier.showError(localize('runtime.test.error', 'Testing failed: {0}', errorMessage))
      deps.telemetry.event('test-failed', { error: errorMessage })
    }
  })

  context.subscriptions.push(disposable)
}
