# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fork of VS Code (Code - OSS) called **MobileForge IDE**, a Flutter-first, AI-native IDE. The branding metadata has been updated in `product.json`. See `MobileForge-IDE-PRD.md` for the full product vision.

## Build & Development Commands

### Initial Setup
```bash
npm install
```

### Build & Compile
```bash
npm run compile          # Compile TypeScript
npm run watch            # Watch mode for client + extensions
npm run watch-client     # Watch mode for client only
npm run watch-extensions # Watch mode for extensions only
```

### Running VS Code
```bash
./scripts/code.sh        # Launch development build (macOS/Linux)
./scripts/code.bat       # Launch development build (Windows)
```

### Testing
```bash
# Unit tests
./scripts/test.sh                           # All unit tests (macOS/Linux)
./scripts/test.sh --grep "<pattern>"        # Filter tests by pattern
npm run test-node                           # Node-only unit tests

# Browser tests
npm run test-browser

# Integration tests (files ending with .integrationTest.ts or in /extensions/)
./scripts/test-integration.sh

# Extension tests
npm run test-extension
```

### Linting & Validation
```bash
npm run eslint           # Run ESLint
npm run stylelint        # Run Stylelint
npm run hygiene          # Run hygiene checks
npm run valid-layers-check  # Check for layering violations
```

## Architecture

VS Code uses a **layered architecture** with strict dependency rules. Lower layers cannot depend on higher layers.

### Layer Hierarchy (bottom to top)
1. **`src/vs/base/`** - Foundation utilities, data structures, cross-platform abstractions
2. **`src/vs/platform/`** - Platform services, dependency injection infrastructure
3. **`src/vs/editor/`** - Monaco text editor (can be used standalone)
4. **`src/vs/workbench/`** - Full IDE workbench

### Workbench Structure (`src/vs/workbench/`)
- **`browser/`** - Core workbench UI components, layout, parts
- **`services/`** - Service implementations
- **`contrib/`** - Feature contributions (git, debug, search, terminal, etc.)
- **`api/`** - Extension host and VS Code API implementation

### Other Key Directories
- **`src/vs/code/`** - Electron main process
- **`src/vs/server/`** - Remote server implementation
- **`extensions/`** - Built-in extensions shipping with VS Code

### Dependency Injection
Services are injected via constructor parameters using decorators. Services are registered and retrieved through a service collection pattern.

### Contribution Model
Features extend VS Code through registries and extension points rather than direct modification.

## Coding Guidelines

### Formatting
- Use **tabs** for indentation, not spaces
- Use **PascalCase** for types and enum values
- Use **camelCase** for functions, methods, properties, and local variables

### Strings & Localization
- Use `"double quotes"` for user-visible strings that need localization
- Use `'single quotes'` for internal strings
- All user-visible strings must use `vs/nls` module for localization
- Use placeholders (`{0}`, `{1}`) instead of string concatenation for localized strings

### Style
- Prefer arrow functions `=>` over anonymous functions
- Always use curly braces for loop and conditional bodies
- Prefer `async/await` over Promise chains
- Prefer `export function` over `export const fn = () =>` for top-level functions
- Do not use `any` or `unknown` unless absolutely necessary

### Code Organization
- All files must include Microsoft copyright header
- Do not export types/functions unless needed across multiple components
- Unit tests live alongside source in `src/vs/*/test/` folders

### UI Labels
- Use title-style capitalization for commands, buttons, and menu items
- Don't capitalize prepositions of four or fewer letters (unless first or last word)
