# Regex-LE Performance Monitoring

Regex-LE includes built-in performance monitoring capabilities to track operation metrics and ensure optimal performance.

## Overview

Performance monitoring is automatically enabled for all extraction, testing, and validation operations. The system tracks:

- **Execution Time** - How long operations take to complete
- **Memory Usage** - Heap memory consumed during operations
- **CPU Usage** - System and user CPU time
- **Operation Metrics** - Items processed, errors, warnings

## Configuration

Performance monitoring can be configured in VS Code settings:

```json
{
  "regex-le.performance.enabled": true,
  "regex-le.performance.maxDuration": 5000,
  "regex-le.performance.maxMemoryUsage": 104857600,
  "regex-le.performance.maxCpuUsage": 1000000
}
```

### Settings

- **`regex-le.performance.enabled`** - Enable/disable performance monitoring (default: `true`)
- **`regex-le.performance.maxDuration`** - Maximum operation duration in milliseconds (default: `5000`)
- **`regex-le.performance.maxMemoryUsage`** - Maximum memory usage in bytes (default: `104857600` = 100MB)
- **`regex-le.performance.maxCpuUsage`** - Maximum CPU usage in microseconds (default: `1000000` = 1 second)

## How It Works

### Automatic Monitoring

When you run extraction, testing, or validation commands, performance monitoring automatically:

1. **Tracks start time** and initial resource usage
2. **Monitors operation progress** during execution
3. **Captures end metrics** when operations complete
4. **Compares against thresholds** to detect performance issues
5. **Reports metrics** via telemetry (if enabled)

### Performance Scoring

Regex patterns are automatically scored for performance:

- **Execution Time** - How fast the pattern executes
- **Pattern Complexity** - Quantifiers, nested groups, backreferences
- **Memory Usage** - Estimated memory consumption
- **Overall Score** - Combined performance rating

Performance scores help identify patterns that may cause performance issues before they impact your application.

## Performance Reports

Performance metrics are displayed in command results:

- Extraction operations show processing time
- Testing operations show execution time per pattern
- Validation operations include performance analysis
- ReDoS detection includes complexity estimates

## Best Practices

1. **Monitor large files** - Enable performance monitoring when processing large files
2. **Check thresholds** - Adjust limits based on your system capabilities
3. **Review metrics** - Use performance scores to optimize slow patterns
4. **Watch for warnings** - System will warn if operations exceed thresholds

## Troubleshooting

### Operations Taking Too Long

If operations exceed `maxDuration`:
- Check file size - large files take longer
- Review pattern complexity - complex patterns are slower
- Consider breaking large files into smaller chunks

### High Memory Usage

If operations exceed `maxMemoryUsage`:
- Large input files consume more memory
- Complex patterns with many matches use more memory
- Consider processing files in smaller batches

### CPU Usage Warnings

If operations exceed `maxCpuUsage`:
- Complex regex patterns require more CPU
- Multiple concurrent operations increase CPU usage
- Consider limiting concurrent operations

## Telemetry

When telemetry is enabled, performance metrics are logged to the Output panel for debugging:

- Operation duration
- Memory usage
- CPU usage
- Item counts
- Errors and warnings

This helps identify performance patterns over time.

## Related Documentation

- [Commands](../README.md#commands) - Available commands and their usage
- [Configuration](../README.md#configuration) - Full configuration options
- [ReDoS Detection](../README.md#redos-detection) - Vulnerability detection

