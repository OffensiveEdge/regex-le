# Regex-LE

**Zero-Hassle Regex Extraction & Validation** - Test, extract, and validate regular expressions directly inside VS Code with real-time match previews, performance scoring, and built-in ReDoS detection.

[![Version](https://img.shields.io/badge/version-1.8.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.regex-le)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## ✨ Features

- 🔍 **Test Regex Patterns** - Test patterns against your code with detailed match information
- 📤 **Extract Matches** - Extract all matches from any file with one command
- ✅ **Validate Patterns** - Check regex validity and detect ReDoS vulnerabilities
- 🚀 **Performance Scoring** - Get performance metrics and optimization suggestions
- 🛡️ **ReDoS Detection** - Built-in protection against Regular Expression Denial of Service attacks
- 🔒 **Zero-Hassle Guarantee** - Works reliably on all text files with automatic safety checks

## 🚀 Quick Start

1. **Open a file** in VS Code (any text file works!)
2. **Press `Ctrl+Alt+R`** (or `Cmd+Alt+R` on Mac) or search for "Regex-LE: Test Regex"
3. **Enter your pattern** (e.g., `/\\d+/` to find numbers)
4. **View results** with matches, positions, and performance metrics

## 📋 Commands

### Test Regex (`regex-le.test`)
Test a regex pattern against the active editor content with detailed results.

**Usage**: `Ctrl+Alt+R` / `Cmd+Alt+R` or Command Palette → "Regex-LE: Test Regex"

**Features**:
- Interactive flag selection (global, case-insensitive, multiline, etc.)
- Line and column position for each match
- ReDoS vulnerability warnings
- Performance scoring and metrics
- Markdown-formatted results report

### Extract Matches (`regex-le.extract`)
Extract all matches from the active file and display them as a list.

**Usage**: Command Palette → "Regex-LE: Extract Matches"

**Features**:
- Automatic global flag for extraction
- Clipboard integration (if enabled)
- Side-by-side results view
- Progress indication for large files

### Validate Pattern (`regex-le.validate`)
Validate a regex pattern and check for security issues.

**Usage**: Command Palette → "Regex-LE: Validate Regex"

**Features**:
- Pattern syntax validation
- ReDoS vulnerability detection
- Performance score calculation
- Security recommendations

### Settings Management
- **Export Settings** - Save your configuration to a JSON file
- **Import Settings** - Restore settings from a previously exported file
- **Reset Settings** - Reset all settings to defaults

## 📁 Supported File Types

**Regex-LE works universally on any text file!** Unlike format-specific extractors that require parsers, regex operates directly on text content, making it truly universal.

### ✅ Recommended File Types (Zero-Hassle Guaranteed)

**Programming Languages**
- JavaScript/TypeScript (`.js`, `.ts`, `.jsx`, `.tsx`, `.mjs`, `.cjs`)
- Python (`.py`, `.pyw`, `.pyi`)
- Ruby (`.rb`, `.rake`)
- Go (`.go`)
- Rust (`.rs`)
- Java (`.java`)
- C/C++ (`.c`, `.cpp`, `.h`, `.hpp`)
- C# (`.cs`)
- PHP (`.php`)
- Swift (`.swift`)
- Kotlin (`.kt`)
- And any other programming language

**Data Formats**
- JSON (`.json`)
- YAML (`.yaml`, `.yml`)
- TOML (`.toml`)
- XML (`.xml`, `.xhtml`)
- CSV (`.csv`)

**Web Technologies**
- HTML (`.html`, `.htm`)
- CSS (`.css`, `.scss`, `.less`, `.sass`)

**Configuration Files**
- Environment (`.env`, `.env.local`, `.env.production`)
- INI (`.ini`, `.cfg`, `.conf`)
- Config files (`.config`, `.conf`)

**Documentation & Text**
- Markdown (`.md`, `.markdown`)
- Plain Text (`.txt`)
- Log Files (`.log`)
- README files
- Documentation (`.rst`, `.tex`, `.org`)

**Shell & Scripts**
- Shell/Bash (`.sh`, `.bash`, `.zsh`)
- PowerShell (`.ps1`)
- Batch (`.bat`, `.cmd`)

### How It Works

Regex-LE applies patterns directly to text content—no format parsing required. This means:

✅ **Works on any text file** VS Code can open  
✅ **No format-specific limitations**  
✅ **Safety checks handle edge cases** (binary detection, size limits)  
✅ **Reliable results** guaranteed by Zero-Hassle design

### Safety Features

Regex-LE automatically protects you:
- 🛡️ **Binary file detection** - Blocks processing of binary files
- 📏 **Size limits** - Warns before processing very large files
- ⚠️ **ReDoS detection** - Warns about vulnerable patterns
- 🚦 **Match limits** - Prevents excessive memory usage

### Examples by File Type

**JavaScript/TypeScript** - Extract function names:
```javascript
// Pattern: /\bfunction\s+(\w+)/g
// Matches: function declarations
```

**JSON** - Extract all string values:
```json
// Pattern: "([^"]+)"
// Matches: All JSON string values
```

**HTML** - Extract all URLs:
```html
<!-- Pattern: https?://[^\s"<>]+ -->
<!-- Matches: All HTTP/HTTPS URLs -->
```

**CSV** - Extract email addresses:
```csv
// Pattern: [\w.-]+@[\w.-]+\.\w+
// Matches: Email addresses in any column
```

**Log Files** - Extract timestamps:
```log
// Pattern: \d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}
// Matches: ISO 8601 timestamps
```

## ⚙️ Configuration

Regex-LE has minimal configuration to keep things simple. Most settings are available in VS Code's settings UI under "Regex-LE".

### Key Settings

- **`regex.realtimePreviewEnabled`** - Enable real-time regex preview (future feature)
- **`regex.redosDetectionEnabled`** - Enable ReDoS vulnerability detection
- **`regex.maxMatchLimit`** - Maximum matches to return (default: 1000)
- **`copyToClipboardEnabled`** - Auto-copy extraction results
- **`openResultsSideBySide`** - Open results side-by-side
- **`notificationsLevel`** - Control notification verbosity (all, important, silent)
- **`safety.enabled`** - Enable safety checks for large files
- **`performance.enabled`** - Enable performance monitoring

For the complete list, open VS Code Settings and search for "regex-le".

### Settings Management

- **Export** - Save your configuration to share or backup
- **Import** - Restore settings from a file
- **Reset** - Restore all settings to defaults

All settings files are validated for security and safety.

## 🌍 Language Support

**13 languages**: English, German, Spanish, French, Indonesian, Italian, Japanese, Korean, Portuguese (Brazil), Russian, Ukrainian, Vietnamese, Chinese (Simplified)

## 🧩 System Requirements

- **VS Code**: 1.70.0 or higher
- **Platform**: Windows, macOS, Linux
- **Node.js**: 20.0.0+ (bundled with VS Code)

## 🔒 Privacy & Security

- **100% local processing** - No data leaves your machine
- **No network requests** - Everything runs locally
- **Optional telemetry** - Local-only logging when enabled
- **Secure settings import** - Validated against schema to prevent malicious configurations
- **ReDoS protection** - Built-in vulnerability detection

## 🎯 Zero-Hassle Guarantee

Regex-LE is designed to "just work" without complications:

✅ **Universal text support** - Works on any file VS Code can open as text  
✅ **Automatic safety checks** - Binary files, size limits handled automatically  
✅ **Graceful error handling** - Clear messages, not cryptic errors  
✅ **Performance protection** - Match limits prevent resource exhaustion  
✅ **ReDoS awareness** - Warns about vulnerable patterns before execution

Unlike format-specific extractors (which require parsers for each file type), regex operates on raw text—making it truly universal while maintaining reliability.

## 🆚 Comparison with Other LE Extensions

| Feature | Regex-LE | Paths-LE | Secrets-LE |
|---------|----------|----------|------------|
| **File Type Support** | ✅ Any text file | ⚠️ 9 specific types | ⚠️ Multiple types |
| **Format Parsing** | ❌ Not needed | ✅ Required | ❌ Regex-based |
| **Zero-Hassle** | ✅ Universal | ⚠️ Format-limited | ✅ Works on text |
| **Custom Patterns** | ✅ User-defined | ❌ Fixed patterns | ⚠️ Pre-defined |

**Key Insight**: Regex-LE offers maximum flexibility—you define the pattern, and it works universally.

## 📚 Learn More

- **Performance Guide** - Learn about regex performance optimization
- **ReDoS Detection** - Understanding Regular Expression Denial of Service
- **File Type Analysis** - See [docs/FILE_TYPE_ANALYSIS.md](docs/FILE_TYPE_ANALYSIS.md) for detailed file type support analysis

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with patterns from the LE extension family:
- Paths-LE, Secrets-LE, Numbers-LE, Dates-LE, URLs-LE, Strings-LE, EnvSync-LE, Scrape-LE

## 📞 Support

- **GitHub Issues**: [Report a bug or request a feature](https://github.com/OffensiveEdge/regex-le/issues)
- **Documentation**: See the `docs/` directory for detailed guides

---

**Made with ❤️ by [OffensiveEdge](https://github.com/OffensiveEdge)**
