# Getting Started with the Extension Template

This guide will help you get started quickly with creating a new VS Code extension from this template.

## Prerequisites

- **Bun** (recommended) or npm installed
- **VS Code** 1.70.0 or higher
- **TypeScript** knowledge
- **Git** for version control

## Quick Start (5 minutes)

### 1. Copy the Template

```bash
# Copy to your new extension directory
cp -r extension-template-le your-extension-le
cd your-extension-le

# Initialize git (optional)
git init
```

### 2. Install Dependencies

```bash
bun install
# or
npm install
```

### 3. Replace Placeholders

Use VS Code's Find & Replace (`Cmd/Ctrl + Shift + H`) to replace these:

| Find              | Replace With         | Example                    |
| ----------------- | -------------------- | -------------------------- |
| `{{namespace}}`   | Your extension ID    | `myextension`              |
| `{{DisplayName}}` | Display Name         | `MyExtension`              |
| `{{description}}` | One-line description | `Extract and analyze data` |
| `{{publisher}}`   | Publisher ID         | `yourpublisher`            |
| `{{author}}`      | GitHub username      | `yourusername`             |

**Tip**: Enable regex mode (.\*) and search in all files.

### 4. Verify the Build

```bash
# Build the extension
bun run build

# Run tests (optional for now)
bun run test

# Lint the code
bun run lint
```

### 5. Test in VS Code

1. Press `F5` to launch the Extension Development Host
2. Open a file
3. Press `Cmd/Ctrl+Alt+E` or search for "Extract" in Command Palette
4. See the sample extraction in action

## What You Get

### ✅ Complete Infrastructure

- **Error Handling**: Enhanced errors with categories, recovery, path sanitization
- **Safety Checks**: File size validation, output size checks, user confirmations
- **Performance Monitoring**: Built-in metrics tracking
- **Telemetry**: Local-only logging (privacy-first)
- **Configuration**: Full settings system with validation
- **Localization**: i18n ready with sample translations
- **Testing**: Vitest setup with VS Code mocks

### ✅ Sample Command

The template includes a complete `extract` command demonstrating:

- ✓ Active editor validation
- ✓ Configuration integration
- ✓ Safety checks
- ✓ Progress indicators
- ✓ Error handling
- ✓ Performance tracking
- ✓ Result presentation
- ✓ Clipboard integration

### ✅ Quality Tools

- **TypeScript**: Strict mode with `noUncheckedIndexedAccess`
- **Biome**: Fast linting and formatting
- **Vitest**: Modern testing framework
- **Coverage**: Built-in coverage reporting

## Next Steps

### 1. Customize the Sample Command

Edit `src/extraction/extract.ts`:

```typescript
export function extractItems(content: string): ExtractionResult {
  // Replace this sample implementation with your logic
  // Current: extracts quoted strings
  // Your implementation: extract your specific data
}
```

### 2. Add Your Format Extractors

Create format-specific extractors in `src/extraction/formats/`:

```typescript
// src/extraction/formats/json.ts
export function extractFromJson(content: string): readonly ExtractedItem[] {
  // Your JSON extraction logic
}
```

### 3. Add More Commands

1. Create command file: `src/commands/myCommand.ts`
2. Register in: `src/commands/index.ts`
3. Add to: `package.json` contributes
4. Add localization strings

### 4. Update Documentation

- `README.md` - User-facing documentation
- `CHANGELOG.md` - Version history
- `package.json` - Description, keywords, etc.

### 5. Create Assets

- **Icon**: `src/assets/images/icon.png` (128x128 or 256x256)
- **Demo**: `src/assets/images/demo.gif` (optional)
- **Screenshots**: Additional promotional images

## Project Structure

```
your-extension-le/
├── src/
│   ├── commands/           # Your commands here
│   ├── extraction/         # Business logic
│   ├── config/            # Configuration
│   ├── services/          # Core services
│   ├── utils/             # Utilities
│   ├── ui/                # UI components
│   └── extension.ts       # Entry point
├── sample/                # Test files
├── package.json           # Manifest
└── README.md             # Documentation
```

## Common Tasks

### Add a New Command

```typescript
// 1. Create src/commands/myCommand.ts
export function registerMyCommand(
  context: vscode.ExtensionContext,
  deps: CommandDependencies
): void {
  const disposable = vscode.commands.registerCommand(
    '{{namespace}}-le.myCommand',
    async () => {
      // Command logic
    }
  );
  context.subscriptions.push(disposable);
}

// 2. Register in src/commands/index.ts
registerMyCommand(context, deps);

// 3. Add to package.json
{
  "commands": [{
    "command": "{{namespace}}-le.myCommand",
    "title": "%manifest.command.myCommand.title%"
  }]
}

// 4. Add localization string
// src/i18n/package.nls.json
{
  "manifest.command.myCommand.title": "My Command"
}
```

### Add a Configuration Setting

```typescript
// 1. Add to package.json
{
  "properties": {
    "{{namespace}}-le.mySetting": {
      "type": "boolean",
      "default": true,
      "description": "%manifest.settings.mySetting.desc%"
    }
  }
}

// 2. Update src/types.ts
export interface Configuration {
  readonly mySetting: boolean;
}

// 3. Update src/config/config.ts
export function getConfiguration(): Configuration {
  return Object.freeze({
    mySetting: Boolean(config.get('mySetting', true)),
  });
}
```

### Run in Development

```bash
# Watch mode for auto-rebuild
bun run watch

# In VS Code, press F5 to launch Extension Development Host
# Make changes, reload window (Cmd+R / Ctrl+R) to test
```

### Package for Distribution

```bash
# Build and package
bun run package

# Your .vsix file will be in release/
# Install locally: code --install-extension release/your-extension-le-0.1.0.vsix
```

## Tips & Tricks

### Testing Your Extension

1. **F5** - Launch Extension Development Host
2. **Cmd/Ctrl+R** - Reload window after changes
3. **Cmd/Ctrl+Shift+I** - Open DevTools for debugging

### Debugging

- Use VS Code Output panel for telemetry logs (enable in settings)
- Add breakpoints in your TypeScript files
- Use `console.log()` for quick debugging

### Performance

- The template includes built-in performance monitoring
- Check metrics in telemetry logs
- Adjust thresholds in configuration

### Localization

- Base strings: `src/i18n/package.nls.json`
- Translations: `src/i18n/package.nls.<locale>.json`
- Use [DeepL](https://www.deepl.com/) for quality translations

## Resources

- **Full Guide**: See `CUSTOMIZATION.md` for detailed instructions
- **Patterns**: See `ENTERPRISE_QUALITY.md` for best practices
- **VS Code Docs**: https://code.visualstudio.com/api
- **LE Extensions**: Reference the other extensions in this workspace

## Troubleshooting

### Build Errors

```bash
# Clean and rebuild
bun run clean
bun run build
```

### Linting Errors

```bash
# Auto-fix most issues
bun run lint:fix
```

### Command Not Showing

- Check `activationEvents` in `package.json`
- Verify command registration in `src/commands/index.ts`
- Reload window in Extension Development Host

### TypeScript Errors

- Ensure strict mode compliance
- Use readonly types
- Check for missing null checks

## Need Help?

1. Check `CUSTOMIZATION.md` for detailed guide
2. Review other LE extensions in workspace
3. Search VS Code extension development docs
4. Check TypeScript strict mode documentation

## Success Checklist

Before publishing:

- [ ] All `{{placeholders}}` replaced
- [ ] Extension logic implemented
- [ ] Tests passing
- [ ] Linting clean
- [ ] Documentation updated
- [ ] Icon created (128x128 or 256x256)
- [ ] Tested in VS Code
- [ ] Version number set
- [ ] CHANGELOG updated

---

**You're ready to build!** Start with the sample command and build from there. 🚀
