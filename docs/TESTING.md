# Regex-LE Testing Guidelines

This document outlines testing practices and policies for Regex-LE development.

## Core Principle

**No broken or failed tests are allowed in commits.**

All tests must pass before code can be committed or merged. This ensures code quality and prevents regressions.

## Running Tests

### Run All Tests

```bash
bun run test
```

### Run Tests with Coverage

```bash
bun run test:coverage
```

### Run Tests in Watch Mode

```bash
bun run test:watch
```

### Run Tests for Specific File

```bash
bun x vitest run src/extraction/regex/extractPatterns.test.ts
```

## Test Structure

### Unit Tests

Located in `src/**/*.test.ts` and `src/**/*.spec.ts`:

- **Pure function tests** - Test extraction logic in isolation
- **Utility tests** - Test helper functions
- **Configuration tests** - Test config validation

### Integration Tests

Located in `src/sampleFiles.spec.ts`:

- **Sample file tests** - Test extraction against real file formats
- **Cross-platform tests** - Ensure case-sensitivity compatibility
- **End-to-end workflows** - Test complete command flows

## Test Coverage Requirements

- **Minimum Coverage**: Maintain reasonable coverage across core functionality
- **Critical Paths**: All extraction logic must be tested
- **Error Handling**: All error paths must be covered
- **Edge Cases**: Boundary conditions must be tested

## Before Committing

### Checklist

- [ ] All tests pass (`bun run test`)
- [ ] No broken tests
- [ ] No skipped tests (unless intentionally)
- [ ] Type checking passes (`bun x tsc -p ./`)
- [ ] Linting passes (`bun run lint`)

### CI/CD Validation

The CI pipeline automatically:

1. Runs all tests on Ubuntu, macOS, and Windows
2. Generates coverage reports
3. Verifies all tests pass
4. Fails the build if any tests fail

## Fixing Failed Tests

### When a Test Fails

1. **Don't commit the failure** - Fix the test or the code
2. **Run locally first** - Verify fix works before pushing
3. **Check all platforms** - Ensure fix works on Linux/Windows (case sensitivity, etc.)
4. **Update test if needed** - If behavior changed intentionally, update test

### Common Issues

- **Case sensitivity** - Use exact case for file references (`README.md` not `readme.md`)
- **Mock issues** - Ensure mocks are properly reset in `beforeEach`
- **Timing issues** - Avoid `async/await` in tests when possible, use static imports

## Test Best Practices

### 1. Use Descriptive Test Names

```typescript
// ✅ Good
it('should extract literal regex patterns with flags', () => {
  // ...
});

// ❌ Bad
it('works', () => {
  // ...
});
```

### 2. Test One Thing Per Test

```typescript
// ✅ Good - separate tests
it('should extract pattern', () => { /* ... */ });
it('should extract flags', () => { /* ... */ });

// ❌ Bad - multiple concerns
it('should extract pattern and flags', () => { /* ... */ });
```

### 3. Use Arrange-Act-Assert Pattern

```typescript
it('should validate regex pattern', () => {
  // Arrange
  const pattern = '/\\d+/g';
  
  // Act
  const result = validateRegex(pattern);
  
  // Assert
  expect(result.valid).toBe(true);
});
```

### 4. Clean Up Mocks

```typescript
beforeEach(() => {
  vi.clearAllMocks();
  // Reset mocks to default state
});
```

## Cross-Platform Testing

### Case Sensitivity

Always use exact case for file references:

```typescript
// ✅ Good - works on all platforms
const content = readSampleFile('README.md');

// ❌ Bad - fails on Linux
const content = readSampleFile('readme.md');
```

### Path Separators

Use platform-agnostic path handling:

```typescript
import { join } from 'path';
const filePath = join(SAMPLE_DIR, filename);
```

## Coverage Reports

Coverage reports are generated automatically:

- **Location**: `coverage/index.html`
- **Format**: HTML, LCOV, JSON
- **CI/CD**: Coverage uploaded as artifact

## Continuous Integration

### GitHub Actions

Tests run automatically on:

- **Ubuntu** (latest)
- **macOS** (latest)
- **Windows** (latest)

All platforms must pass for the build to succeed.

### Pre-commit Hooks

Consider setting up pre-commit hooks to run tests before commits:

```bash
# Install husky (if needed)
bun add -d husky

# Add pre-commit hook
echo "bun run test" > .husky/pre-commit
```

## Reporting Test Issues

If you encounter test failures:

1. **Run locally** - Verify it fails consistently
2. **Check CI logs** - See platform-specific errors
3. **Reproduce** - Document steps to reproduce
4. **Fix or report** - Either fix or create an issue

## Related Documentation

- [Performance Monitoring](PERFORMANCE.md) - Performance testing and benchmarks
- [Architecture](../README.md#technical-implementation) - Code structure
- [Contributing](../README.md#contributing) - Contribution guidelines

