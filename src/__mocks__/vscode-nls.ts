/**
 * Mock for vscode-nls module used in tests
 */

export enum MessageFormat {
  file = 'file',
  bundle = 'bundle',
  both = 'both',
}

export function config(_options?: {
  messageFormat?: MessageFormat
}): () => (key: string, ...args: unknown[]) => string {
  return () =>
    (key: string, ...args: unknown[]): string => {
      // Simple mock that returns the key with args interpolated
      let message = key
      args.forEach((arg, index) => {
        message = message.replace(`{${index}}`, String(arg))
      })
      return message
    }
}

export function loadMessageBundle(): (key: string, ...args: unknown[]) => string {
  return (key: string, ...args: unknown[]): string => {
    let message = key
    args.forEach((arg, index) => {
      message = message.replace(`{${index}}`, String(arg))
    })
    return message
  }
}

