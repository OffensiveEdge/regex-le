# Changelog

All notable changes to Regex-LE will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.1] - 2025-11-02

### Documentation

- **LE Family Updates** - Added Secrets-LE to the "More from the LE Family" section in README

## [1.7.0] - 2025-11-02

### Initial Public Release

Regex-LE brings zero-hassle regex extraction and validation to VS Code. Simple, reliable, focused.

#### Core Features

- **Automatic Pattern Extraction** - Automatically finds all regex patterns in your code:
  - Literal regex patterns (`/pattern/flags`)
  - `new RegExp()` constructor calls
  - `RegExp()` function calls
  - Automatic deduplication of identical patterns
- **Pattern Testing** - Test extracted patterns against file content with detailed results:
  - Match results with positions and groups
  - Execution time metrics
  - Performance scoring
  - ReDoS vulnerability warnings
- **Pattern Validation** - Validate all patterns automatically:
  - Syntax validation
  - ReDoS detection with severity levels
  - Performance analysis
  - Comprehensive validation reports

#### Supported File Types

Regex-LE works universally on any text file format:

- **Programming Languages**: JavaScript, TypeScript, Python, Ruby, Go, Rust, Java, C/C++, C#, PHP, Swift, Kotlin
- **Data Formats**: JSON, YAML, TOML, XML, CSV
- **Web**: HTML, CSS, SCSS, LESS, Sass
- **Configuration**: .env, .ini, .cfg, .conf
- **Documentation**: Markdown, Plain Text, Log Files
- **Shell Scripts**: Bash, Zsh, PowerShell, Batch

#### Advanced Features

- **ReDoS Detection** - Built-in vulnerability detection:
  - Nested quantifier detection
  - Exponential backtracking analysis
  - Complexity estimation
  - Security warnings before execution
- **Performance Scoring** - Actionable optimization recommendations:
  - Execution time analysis
  - Pattern complexity scoring
  - Optimization suggestions
- **Safety Features**:
  - Binary file detection
  - File size warnings (configurable thresholds)
  - Match limits to prevent excessive memory usage
  - Automatic safety checks

#### Commands

- **Extract Matches** - Automatically extract all regex patterns (zero prompts)
- **Test Regex** (`Cmd/Ctrl+Alt+R`) - Test patterns with detailed results
- **Validate Pattern** - Validate all patterns and check for ReDoS vulnerabilities
- **Open Settings** - Quick access to configuration
- **Help & Troubleshooting** - In-editor documentation

#### Configuration

- ReDoS detection (enabled/disabled, max depth)
- Performance scoring (enabled/disabled)
- Preview settings (auto-update, max matches)
- Output preferences (side-by-side, clipboard copy)
- Safety thresholds (file size, output limits)
- Notification levels (silent, important, all)
- Status bar visibility
- Local telemetry logging

#### Infrastructure

- **TypeScript** - Strict mode with comprehensive type safety
- **Testing** - 81 unit tests across 5 test files with Vitest
- **Code Quality** - Biome for linting and formatting
- **Localization** - English language support (13 languages coming in v1.8.0)
- **Factory-based Architecture** - Dependency injection and service factories
- **Immutable Data Structures** - All exports frozen with `Object.freeze()`
- **Error Handling** - Enterprise-grade error categorization and recovery

#### Performance

- Built-in performance monitoring
- Configurable thresholds
- Efficient pattern extraction
- Memory-optimized operations

#### Privacy

- 100% local processing
- No data collection
- Optional local-only telemetry logging to Output panel
