# VS Code Extension Template (LE Family)

A production-ready VS Code extension template with enterprise-grade infrastructure based on patterns from the LE extension family.

## Features

This template includes:

- ✅ **Full TypeScript strict mode** - `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- ✅ **Complete error handling** - Enhanced errors with categories, recovery, user-friendly messages
- ✅ **Safety checks** - File size warnings, output validation, user confirmations
- ✅ **Performance monitoring** - Built-in metrics tracking and thresholds
- ✅ **Localization ready** - i18n with vscode-nls, template for 13+ languages
- ✅ **Service architecture** - Factory pattern with dependency injection
- ✅ **Testing infrastructure** - Vitest with VS Code mocks and coverage
- ✅ **Sample command** - Fully-implemented extract command demonstrating all patterns

## Quick Start

### 1. Clone and Customize

```bash
# Copy this template to your new extension
cp -r extension-template-le your-extension-le
cd your-extension-le

# Install dependencies
bun install
```

### 2. Replace Placeholders

Search and replace these placeholders throughout the codebase:

- `{{namespace}}` - Extension namespace (e.g., `colors`, `paths`, `strings`)
- `{{DisplayName}}` - Display name (e.g., `Colors`, `Paths`, `Strings`)
- `{{description}}` - Extension description
- `{{publisher}}` - Publisher name
- `{{author}}` - Author/organization name

**Files to update:**

- `package.json`
- `src/**/*.ts`
- `src/i18n/**/*.json`
- `README.md`

### 3. Customize the Sample Command

The template includes a complete sample extraction command in `src/commands/extract.ts` that demonstrates:

- Active editor validation
- Configuration integration
- Safety checks with user confirmation
- Progress indicators
- Error handling with recovery
- Performance monitoring
- Result presentation (new document, clipboard)
- Telemetry tracking

**Replace the extraction logic** in `src/extraction/extract.ts` with your actual implementation.

### 4. Build and Test

```bash
# Build
bun run build

# Run tests
bun run test

# Run with coverage
bun run test:coverage

# Lint
bun run lint
```

### 5. Package

```bash
# Create .vsix package
bun run package

# List package contents
bun run package:ls
```

## Project Structure

```
extension-template-le/
├── src/
│   ├── commands/           # Command handlers
│   │   ├── index.ts        # Command registration
│   │   ├── extract.ts      # SAMPLE: Full pattern implementation
│   │   └── help.ts         # Help command
│   ├── config/             # Configuration
│   │   ├── config.ts       # Config reader
│   │   └── settings.ts     # Settings command
│   ├── services/           # Core services
│   │   └── serviceFactory.ts
│   ├── telemetry/          # Local telemetry
│   │   └── telemetry.ts
│   ├── ui/                 # UI components
│   │   ├── notifier.ts     # Notifications
│   │   ├── statusBar.ts    # Status bar
│   │   └── output.ts       # Output channel
│   ├── utils/              # Utilities
│   │   ├── errorHandling.ts # Enhanced errors
│   │   ├── safety.ts       # Safety checks
│   │   ├── performance.ts  # Performance monitoring
│   │   └── localization.ts # i18n helpers
│   ├── extraction/         # Business logic
│   │   ├── extract.ts      # Main extraction
│   │   └── formats/        # Format-specific extractors
│   ├── __mocks__/          # Test mocks
│   │   ├── vscode.ts
│   │   └── vscode-nls.ts
│   ├── i18n/               # Localization files
│   │   └── package.nls*.json
│   ├── assets/             # Images
│   ├── types.ts            # Type definitions
│   └── extension.ts        # Entry point
├── sample/                 # Sample files for testing
├── package.json            # Extension manifest
├── tsconfig.json           # TypeScript config
├── biome.json              # Linting config
├── vitest.config.ts        # Test config
└── README.md               # This file
```

## Key Patterns

### TypeScript

- **Strict mode** - Zero tolerance for type errors
- **Readonly types** - Immutability by default
- **Object.freeze()** - Runtime immutability for exports
- **Factory functions** - Over classes for simplicity
- **Pure functions** - With explicit return types

### Error Handling

```typescript
import { createEnhancedError } from './utils/errorHandling'

const error = createEnhancedError(
  new Error('Something went wrong'),
  'parse', // category
  { filepath: '/path/to/file' }, // context
  {
    recoverable: true,
    severity: 'medium',
    suggestion: 'Check file format',
  },
)

await notifier.showEnhancedError(error)
```

### Configuration

```typescript
import { getConfiguration } from './config/config'

const config = getConfiguration()
if (config.safetyEnabled) {
  // Perform safety checks
}
```

### Safety Checks

```typescript
import { handleSafetyChecks } from './utils/safety'

const safetyResult = handleSafetyChecks(document, config)
if (!safetyResult.proceed) {
  // Show error and return
}
```

### Performance Monitoring

```typescript
const tracker = performanceMonitor.startOperation('extract', inputSize)
// ... do work ...
const metrics = tracker.end(outputSize, itemCount, errors, warnings)
```

### Service Factory

```typescript
// In extension.ts
const services = createServices(context)

// Use services
services.telemetry.event('command-invoked')
services.notifier.showInfo('Success!')
```

## Configuration Schema

The template includes these standard settings:

- `copyToClipboardEnabled` - Auto-copy results
- `dedupeEnabled` - Remove duplicates
- `notificationsLevel` - Control notification verbosity
- `openResultsSideBySide` - Side-by-side results
- `safety.enabled` - Enable safety checks
- `safety.fileSizeWarnBytes` - File size threshold
- `safety.largeOutputLinesThreshold` - Output size threshold
- `statusBar.enabled` - Show status bar item
- `telemetryEnabled` - Local telemetry logging
- `performance.enabled` - Performance monitoring
- `performance.maxDuration` - Max operation duration

## Testing

```bash
# Run all tests
bun run test

# Watch mode
bun run test:watch

# Coverage report
bun run test:coverage

# UI mode
bun run test:ui
```

Tests use Vitest with VS Code API mocks. Add tests alongside source files with `.test.ts` extension.

## Localization

Add localized strings to `src/i18n/package.nls.<locale>.json`:

```json
{
  "manifest.command.extract.title": "Extract Items",
  "runtime.extract.complete": "Extracted {0} items"
}
```

Use in code:

```typescript
const localize = nls.config({ messageFormat: nls.MessageFormat.file })()
const message = localize('runtime.extract.complete', itemCount)
```

## Scripts

- `build` - Compile TypeScript
- `watch` - Watch mode for development
- `test` - Run tests
- `test:coverage` - Run tests with coverage
- `lint` - Check code quality
- `lint:fix` - Fix linting issues
- `clean` - Remove build artifacts
- `package` - Create .vsix package
- `publish` - Publish to marketplace

## Contributing

This template is based on patterns from the LE extension family:

- Colors-LE
- Paths-LE
- Numbers-LE
- Dates-LE
- URLs-LE
- Strings-LE
- EnvSync-LE
- Scrape-LE

## License

MIT License - See LICENSE file for details

## Support

For issues with the template, see [GitHub Issues](https://github.com/{{author}}/{{namespace}}-le/issues)
