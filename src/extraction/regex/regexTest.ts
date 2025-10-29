import type { PerformanceMetrics, RegexGroup, RegexMatch, RegexTestResult } from '../../types'

/**
 * Test a regex pattern against text and return matches
 */
export function testRegexPattern(
  pattern: string,
  flags: string,
  text: string,
  maxMatches: number = 1000,
): RegexTestResult {
  try {
    const regex = new RegExp(pattern, flags)
    const matches: RegexMatch[] = []
    let match: RegExpExecArray | null = null

    // Use exec for proper global matching with groups
    let execCount = 0
    while ((match = regex.exec(text)) !== null && matches.length < maxMatches) {
      execCount++

      // Prevent infinite loops from zero-width matches
      if (match.index === regex.lastIndex && match[0].length === 0) {
        regex.lastIndex++
        if (execCount > 10000) {
          break
        }
      }

      const groups: RegexGroup[] = []

      // Extract capture groups
      for (let i = 1; i < match.length; i++) {
        if (match[i] !== undefined) {
          const groupName = getGroupName(regex, i - 1)
          const groupMatchStart = match.index + getGroupStartPosition(match, i)
          const groupMatchEnd = groupMatchStart + (match[i]?.length || 0)

          groups.push(
            Object.freeze({
              index: i - 1,
              name: groupName,
              value: match[i] || '',
              start: groupMatchStart,
              end: groupMatchEnd,
            }),
          )
        }
      }

      // Calculate line and column
      const { line, column } = getPosition(text, match.index)

      matches.push(
        Object.freeze({
          match: match[0],
          index: match.index,
          groups: groups.length > 0 ? Object.freeze(groups) : undefined,
          line,
          column,
        }),
      )

      // If not global, break after first match
      if (!flags.includes('g')) {
        break
      }

      // Prevent infinite loop
      if (regex.lastIndex === match.index && match[0].length === 0) {
        regex.lastIndex++
      }
    }

    return Object.freeze({
      success: true,
      pattern,
      flags,
      matches: Object.freeze(matches),
      errors: Object.freeze([]),
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return Object.freeze({
      success: false,
      pattern,
      flags,
      matches: Object.freeze([]),
      errors: Object.freeze([
        Object.freeze({
          type: 'parse-error' as const,
          message: errorMessage,
        }),
      ]),
    })
  }
}

/**
 * Get the name of a capture group (if named)
 */
function getGroupName(regex: RegExp, groupIndex: number): string | undefined {
  // This is a simplified version - proper implementation would parse the regex
  // to extract named groups. For now, we'll just return undefined.
  return undefined
}

/**
 * Calculate the start position of a capture group
 */
function getGroupStartPosition(match: RegExpExecArray, groupIndex: number): number {
  // Find where the group starts relative to the match start
  let pos = 0
  const target = match[groupIndex]
  if (!target) {
    return 0
  }

  // Simplified: assumes group text appears in order within the match
  const matchText = match[0]
  const groupStart = matchText.indexOf(target)
  return groupStart >= 0 ? groupStart : 0
}

/**
 * Get line and column from character index
 */
function getPosition(text: string, index: number): { line: number; column: number } {
  const beforeMatch = text.substring(0, index)
  const lines = beforeMatch.split('\n')
  const line = lines.length
  const column = lines[lines.length - 1]?.length || 0
  return { line, column }
}

/**
 * Test regex with performance tracking
 */
export function testRegexWithPerformance(
  pattern: string,
  flags: string,
  text: string,
  maxMatches: number,
  startTime: number,
): RegexTestResult & { performance: PerformanceMetrics } {
  const testResult = testRegexPattern(pattern, flags, text, maxMatches)
  const endTime = performance.now()
  const duration = endTime - startTime

  const performance: PerformanceMetrics = Object.freeze({
    operation: 'regex-test',
    startTime,
    endTime,
    duration,
    inputSize: text.length,
    outputSize: testResult.matches.length,
    itemCount: testResult.matches.length,
    memoryUsage: 0, // Would need actual measurement
    cpuUsage: 0, // Would need actual measurement
    warnings: testResult.warnings?.length || 0,
    errors: testResult.errors.length,
  })

  return Object.freeze({
    ...testResult,
    performance,
  })
}
