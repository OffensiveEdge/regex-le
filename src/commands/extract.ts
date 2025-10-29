import * as vscode from 'vscode'
import * as nls from 'vscode-nls'
import { getConfiguration } from '../config/config'
import { testRegexPattern } from '../extraction/regex/regexTest'
import type { Telemetry } from '../telemetry/telemetry'
import type { Notifier } from '../ui/notifier'
import type { StatusBar } from '../ui/statusBar'
import { handleSafetyChecks } from '../utils/safety'

const localize = nls.config({ messageFormat: nls.MessageFormat.file })()

/**
 * Register the regex extract command
 * Extracts all matches from the active editor using a regex pattern
 */
export function registerExtractCommand(
  context: vscode.ExtensionContext,
  deps: Readonly<{
    telemetry: Telemetry
    notifier: Notifier
    statusBar: StatusBar
  }>,
): void {
  const disposable = vscode.commands.registerCommand('regex-le.extract', async () => {
    deps.telemetry.event('command-extract')

    const editor = vscode.window.activeTextEditor
    if (!editor) {
      deps.notifier.showWarning(
        localize('runtime.extract.no-editor', 'No active editor. Please open a file first.'),
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
      prompt: localize('runtime.extract.pattern.prompt', 'Enter regex pattern'),
      placeHolder: localize('runtime.extract.pattern.placeholder', 'e.g., /\\d+/'),
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return localize('runtime.extract.pattern.invalid', 'Pattern cannot be empty')
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
      flags = patternMatch[2] || 'g' // Default to global for extraction
    } else {
      pattern = patternInput.trim()
      flags = 'g' // Default to global
    }

    // Ensure global flag for extraction
    if (!flags.includes('g')) {
      flags += 'g'
    }

    try {
      await deps.notifier.showProgress(
        localize('runtime.extract.progress', 'Extracting matches...'),
        async (progress, _token) => {
          progress.report({ message: 'Processing...', increment: 50 })

          const text = document.getText()
          const result = testRegexPattern(pattern, flags, text, config.regexMaxMatchLimit)

          progress.report({ message: 'Formatting results...', increment: 50 })

          if (!result.success) {
            deps.notifier.showError(
              localize(
                'runtime.extract.error',
                'Extraction failed: {0}',
                result.errors[0]?.message || 'Unknown error',
              ),
            )
            return
          }

          // Format results
          const outputLines: string[] = []

          if (result.matches.length === 0) {
            outputLines.push(localize('runtime.extract.no-matches', 'No matches found.'))
          } else {
            for (const match of result.matches) {
              outputLines.push(match.match)
            }
          }

          const output = outputLines.join('\n')

          // Copy to clipboard if enabled
          if (config.copyToClipboardEnabled) {
            await vscode.env.clipboard.writeText(output)
            deps.notifier.showInfo(
              localize(
                'runtime.extract.copied',
                'Extracted {0} matches to clipboard',
                result.matches.length,
              ),
            )
          }

          // Open result document
          const doc = await vscode.workspace.openTextDocument({
            content: output,
            language: 'plaintext',
          })

          const viewColumn = config.openResultsSideBySide
            ? vscode.ViewColumn.Beside
            : vscode.ViewColumn.Active

          await vscode.window.showTextDocument(doc, viewColumn)

          deps.telemetry.event('extract-completed', {
            matchCount: result.matches.length,
          })

          if (config.notificationsLevel === 'all') {
            deps.notifier.showInfo(
              localize('runtime.extract.complete', 'Extracted {0} matches', result.matches.length),
            )
          }
        },
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      deps.notifier.showError(
        localize('runtime.extract.error', 'Extraction failed: {0}', errorMessage),
      )
      deps.telemetry.event('extract-failed', { error: errorMessage })
    }
  })

  context.subscriptions.push(disposable)
}
