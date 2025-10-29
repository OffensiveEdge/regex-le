import * as vscode from 'vscode'

/**
 * Output channel for extension logging
 */
export interface OutputChannel {
  log(message: string): void
  error(message: string): void
  warn(message: string): void
  show(): void
  dispose(): void
}

export function createOutputChannel(name: string): OutputChannel {
  const channel = vscode.window.createOutputChannel(name)

  return Object.freeze({
    log(message: string): void {
      const timestamp = new Date().toISOString()
      channel.appendLine(`[${timestamp}] ${message}`)
    },
    error(message: string): void {
      const timestamp = new Date().toISOString()
      channel.appendLine(`[${timestamp}] ERROR: ${message}`)
    },
    warn(message: string): void {
      const timestamp = new Date().toISOString()
      channel.appendLine(`[${timestamp}] WARN: ${message}`)
    },
    show(): void {
      channel.show()
    },
    dispose(): void {
      channel.dispose()
    },
  })
}
