# Template Customization Guide

Follow these steps to customize the template for your extension.

## Step 1: Global Find & Replace

Replace these placeholders throughout the entire codebase:

| Placeholder       | Example                        | Description                                      |
| ----------------- | ------------------------------ | ------------------------------------------------ |
| `{{namespace}}`   | `colors`                       | Lowercase identifier (for commands, config keys) |
| `{{DisplayName}}` | `Colors`                       | Title case display name                          |
| `{{description}}` | `Zero Hassle Color Extraction` | One-line description                             |
| `{{publisher}}`   | `nolindnaidoo`                 | VS Code marketplace publisher ID                 |
| `{{author}}`      | `OffensiveEdge`                | Your GitHub username/org                         |

### Files to Search

Search these patterns in:

- `package.json`
- `src/**/*.ts`
- `src/i18n/**/*.json`
- `README.md`
- `CHANGELOG.md`
- `ENTERPRISE_QUALITY.md`
- `CUSTOMIZATION.md` (this file)

### VS Code Find & Replace

1. Press `Cmd/Ctrl + Shift + H` to open Find & Replace
2. Enable "Use Regular Expression" (.\*)
3. Find: `\{\{namespace\}\}` → Replace with your namespace
4. Find: `\{\{DisplayName\}\}` → Replace with your display name
5. Repeat for all placeholders

## Step 2: Update Extension Details

### package.json

1. Update keywords array with relevant terms
2. Adjust categories if needed
3. Update keybinding (currently `Ctrl+Alt+E`)
4. Review activation events
5. Add/remove configuration properties as needed

### Icon

1. Create a 128x128 or 256x256 PNG icon
2. Save as `src/assets/images/icon.png`
3. Follow VS Code icon guidelines (see assets/images/README.md)

## Step 3: Implement Your Logic

### Core Extraction Logic

Replace the sample implementation in `src/extraction/extract.ts`:

```typescript
export function extractItems(content: string): ExtractionResult {
  // TODO: Replace with your actual extraction logic
  // Current implementation extracts quoted strings as a demo
}
```

### Format-Specific Extractors

Add format-specific extractors in `src/extraction/formats/`:

```typescript
// Example: src/extraction/formats/json.ts
export function extractFromJson(content: string): readonly ExtractedItem[] {
  // Your JSON-specific extraction logic
}
```

### Update Types

Modify `src/types.ts` if you need different data structures:

```typescript
export interface ExtractedItem {
  readonly value: string
  // Add your custom fields here
  readonly customField?: string
}
```

## Step 4: Customize Commands

### Add New Commands

1. Create command file in `src/commands/`
2. Implement command handler
3. Register in `src/commands/index.ts`
4. Add to `package.json` contributes.commands
5. Add localization strings

Example:

```typescript
// src/commands/myCommand.ts
export function registerMyCommand(
  context: vscode.ExtensionContext,
  deps: CommandDependencies,
): void {
  const disposable = vscode.commands.registerCommand('{{namespace}}-le.myCommand', async () => {
    // Command logic
  })
  context.subscriptions.push(disposable)
}
```

### Update Command Palette

In `package.json`:

```json
{
  "commands": [
    {
      "command": "{{namespace}}-le.myCommand",
      "title": "%manifest.command.myCommand.title%",
      "category": "%manifest.command.category%"
    }
  ]
}
```

## Step 5: Configure Settings

### Add Settings

In `package.json` under `contributes.configuration.properties`:

```json
"{{namespace}}-le.myCustomSetting": {
  "type": "boolean",
  "default": true,
  "description": "%manifest.settings.myCustomSetting.desc%"
}
```

### Update Config Type

In `src/types.ts`:

```typescript
export interface Configuration {
  // ... existing fields
  readonly myCustomSetting: boolean
}
```

### Update Config Reader

In `src/config/config.ts`:

```typescript
export function getConfiguration(): Configuration {
  const config = vscode.workspace.getConfiguration('{{namespace}}-le')

  return Object.freeze({
    // ... existing fields
    myCustomSetting: Boolean(config.get('myCustomSetting', true)),
  })
}
```

## Step 6: Add Localization

### English (Base)

In `src/i18n/package.nls.json`:

```json
{
  "manifest.command.myCommand.title": "My Command",
  "runtime.myCommand.success": "Command completed successfully"
}
```

### Other Languages

Copy base structure to language-specific files:

- `package.nls.de.json` (German)
- `package.nls.es.json` (Spanish)
- `package.nls.fr.json` (French)
- etc.

Use [DeepL](https://www.deepl.com/) or [Google Translate](https://translate.google.com/) for translations.

## Step 7: Write Tests

### Unit Tests

Create tests alongside source files with `.test.ts` extension:

```typescript
// src/extraction/extract.test.ts
import { describe, expect, it } from 'vitest'
import { extractItems } from './extract'

describe('extractItems', () => {
  it('should extract items from content', () => {
    const content = 'test content'
    const result = extractItems(content)

    expect(result.success).toBe(true)
    expect(result.items.length).toBeGreaterThan(0)
  })
})
```

### Run Tests

```bash
bun run test           # Run once
bun run test:watch     # Watch mode
bun run test:coverage  # With coverage
```

## Step 8: Update Documentation

### README.md

1. Replace template sections with your content
2. Add specific use cases
3. Include relevant examples
4. Update feature list

### CHANGELOG.md

1. Update version number
2. Add release date
3. List features, changes, fixes

### ENTERPRISE_QUALITY.md (Optional)

Document your extension's quality metrics:

- Test coverage
- Performance benchmarks
- Security measures

## Step 9: Create Demo Assets

### Demo GIF

1. Record extension in action (10-15 seconds)
2. Save as `src/assets/images/demo.gif`
3. Keep under 5MB

### Screenshots

1. Capture command palette
2. Save as `src/assets/images/command-palette.png`

## Step 10: Build & Test

### Development

```bash
# Install dependencies
bun install

# Build
bun run build

# Watch mode
bun run watch
```

### Test in VS Code

1. Press `F5` to launch Extension Development Host
2. Test all commands
3. Verify configuration works
4. Check error handling
5. Test with various file types

### Package

```bash
# Create .vsix package
bun run package

# Inspect package contents
bun run package:ls
```

## Step 11: Publish

### Prerequisites

1. [VS Code Publisher Account](https://marketplace.visualstudio.com/manage)
2. Personal Access Token from Azure DevOps

### Publish

```bash
# First time: create publisher
vsce create-publisher <publisher-name>

# Login
vsce login <publisher-name>

# Publish
bun run publish
```

### Marketplace

1. Add README badges
2. Upload screenshots
3. Set categories
4. Add keywords for SEO

## Checklist

Before publishing:

- [ ] All placeholders replaced
- [ ] Extension logic implemented
- [ ] Tests written and passing
- [ ] Linting passes (`bun run lint`)
- [ ] Documentation updated
- [ ] Icon created
- [ ] Demo assets created (optional)
- [ ] Tested in VS Code
- [ ] Version number set
- [ ] CHANGELOG updated
- [ ] LICENSE reviewed

## Common Issues

### TypeScript Errors

Run `bun run lint` to find issues. Most common:

- Incorrect return types
- Missing null checks
- Unused variables

### Commands Not Showing

Check:

- Command registered in `package.json`
- Command handler registered in `src/commands/index.ts`
- Activation events include command

### Configuration Not Working

Verify:

- Setting defined in `package.json`
- Type added to Configuration interface
- Config reader updated in `config.ts`

## Support

For template issues:

- Review existing LE extensions for patterns
- Check VS Code extension docs
- Search VS Code extension development discussions

## Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [VS Code Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Extension Samples](https://github.com/microsoft/vscode-extension-samples)
