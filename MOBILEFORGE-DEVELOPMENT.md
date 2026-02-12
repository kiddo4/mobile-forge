# MobileForge IDE Development Guide

> Building a Flutter-First AI-Powered IDE from VS Code

## 🎯 Project Overview

**MobileForge IDE** is a complete fork of VS Code, designed from the ground up for mobile development. Unlike typical VS Code extensions, we're modifying the core workbench to create a distinct product—similar to how Cursor forked VS Code for AI-first development.

### Key Differences from VS Code

| Aspect | VS Code | MobileForge IDE |
|--------|---------|-----------------|
| Focus | General-purpose | Flutter-first, mobile-specific |
| AI | Extension-based (Copilot) | Built into core workbench |
| Setup | Manual SDK configuration | Zero-config, bundled Flutter SDK |
| UI | Neutral, customizable | Mobile-focused, custom theme |
| Workflow | File-centric | Project-centric (Flutter projects) |

---

## 📂 Project Structure

### Core MobileForge Files

```
vscode/ (your fork)
├── product.json                          # ✅ MobileForge branding
├── src/vs/workbench/
│   ├── workbench.common.main.ts          # ✅ Registered MobileForge contribution
│   └── contrib/mobileforge/              # ✅ Our core features
│       └── browser/
│           └── mobileforge.contribution.ts  # Main workbench integration
├── extensions/mobileforge-core/          # ✅ Pre-bundled extension
│   ├── src/
│   │   ├── extension.ts
│   │   ├── ai/                           # AI integration (TODO)
│   │   ├── figma/                        # Figma converter (TODO)
│   │   ├── flutter/
│   │   │   └── environmentHealth.ts
│   │   └── ui/
│   │       └── welcomeView.ts
│   └── package.json
└── resources/                            # TODO: Flutter SDK bundle
```

---

## ✅ What We've Built So Far

### Phase 1, Month 1 Progress

#### 1. Build Environment ✅
- Fixed Node.js version (v22.20.0 as required by VS Code)
- Configured build pipeline
- Successfully compiled VS Code with MobileForge changes

#### 2. Branding ✅
- Updated [product.json](product.json) with MobileForge naming:
  - `nameShort`: "MobileForge"
  - `nameLong`: "MobileForge IDE"
  - `applicationName`: "mobileforge-ide"
  - `darwinBundleIdentifier`: "com.mobileforge.ide"

#### 3. Core Workbench Integration ✅
- Created [src/vs/workbench/contrib/mobileforge/browser/mobileforge.contribution.ts](src/vs/workbench/contrib/mobileforge/browser/mobileforge.contribution.ts)
- Registered in [workbench.common.main.ts](src/vs/workbench/workbench.common.main.ts)
- Added commands:
  - `mobileforge.showWelcome` - Show MobileForge welcome
  - `mobileforge.checkEnvironment` - Check Flutter/Dart/Android/iOS status

#### 4. Extension Foundation ✅
- Created `extensions/mobileforge-core/` with modular structure
- Welcome view with Flutter-focused UI
- Environment health monitoring (placeholder)

---

## 🚀 How to Build & Run

### Development Workflow

```bash
# 1. Ensure you're using Node.js v22
node --version  # Should show v22.x

# 2. Install dependencies (if not done)
npm install

# 3. Compile the IDE
npm run compile

# 4. Run in watch mode (auto-recompile on changes)
npm run watch

# 5. Launch MobileForge IDE
# Press F5 in VS Code, or:
./scripts/code.sh
```

### First Launch

When you run MobileForge IDE for the first time, you'll see:
1. A welcome notification: "Welcome to MobileForge IDE - Your Flutter-First Development Environment! 🚀"
2. Access to MobileForge commands via Command Palette (Cmd+Shift+P):
   - "MobileForge: Show Welcome"
   - "MobileForge: Check Environment Health"

---

## 🎨 Architecture: Core vs Extension

### Why Both?

We're using a **hybrid approach** for maximum flexibility:

#### Core Workbench (`src/vs/workbench/contrib/mobileforge/`)
**What goes here:**
- Features that need deep integration with VS Code internals
- Custom UI modifications (themes, activity bar, status bar)
- Performance-critical features
- Features that should "feel native" to the IDE

**Examples:**
- Custom welcome screen (replaces VS Code's)
- Flutter project templates in "New File" menu
- Custom status bar items (Flutter SDK version, device selector)
- AI inline completions (tight editor integration)

#### MobileForge Extension (`extensions/mobileforge-core/`)
**What goes here:**
- Features that can work as extensions
- Things that might update independently
- Features that use VS Code Extension API

**Examples:**
- Environment health panel (uses TreeView API)
- Figma import commands
- AI chat panel (uses Webview API)
- Widget tree visualizer

---

## 🎯 Next Steps

### Immediate (This Week)

1. **Custom Welcome Screen**
   - Replace VS Code's getting started with Flutter-focused onboarding
   - Location: `src/vs/workbench/contrib/welcomeGettingStarted/`
   - Show: Create Flutter App, Import from Figma, Check Environment

2. **Custom Color Theme**
   - Create `mobileforge-dark` and `mobileforge-light` themes
   - Gradient accents (purple to blue, per your PRD)
   - Set as default in product.json

3. **Test the Build**
   - Run `npm run compile`
   - Launch with F5
   - Verify MobileForge branding appears
   - Test commands work

### Short Term (This Month)

4. **Bundle Flutter SDK**
   - Download Flutter SDK to `resources/flutter-sdk/`
   - Modify PATH at runtime to use bundled SDK
   - Implement actual environment checks

5. **AI Integration**
   - Set up Claude API integration in `src/vs/workbench/contrib/mobileforge/`
   - Create inline completion provider (Flutter-aware)
   - Add chat panel for code generation

6. **Branding Assets**
   - Design MobileForge icon
   - Create splash screen
   - Update application icons for macOS/Windows/Linux

### Medium Term (Months 2-3)

7. **Figma Integration**
   - Build Figma plugin (separate repo)
   - Create widget mapper in `extensions/mobileforge-core/src/figma/`
   - AI-assisted design-to-code conversion

8. **Widget Tree Visualizer**
   - Custom panel showing Flutter widget hierarchy
   - Live updates as code changes
   - Click to navigate to widget definition

9. **Deployment Wizard**
   - iOS certificate management
   - Android keystore handling
   - One-click build and deploy

---

## 🏗️ Development Principles

### 1. Fork, Don't Extend
- We modify VS Code core, not just add extensions
- This gives us full control over the UX
- Similar to Cursor's approach

### 2. Flutter-First, Not Flutter-Only
- Start with Flutter as the primary workflow
- Design can expand to React Native, Native iOS/Android later
- But every UI decision should optimize for Flutter first

### 3. Zero Config Philosophy
- User downloads and runs—Flutter works immediately
- No "install Flutter SDK" step
- No PATH configuration
- No Android Studio requirement

### 4. AI Native
- AI isn't a feature, it's the foundation
- Every interaction should have AI assistance available
- Context-aware: knows Flutter, widgets, state management

---

## 📝 Code Contribution Guidelines

### Adding Features to Core Workbench

1. Create files in `src/vs/workbench/contrib/mobileforge/`
2. Register in `workbench.common.main.ts`
3. Use VS Code's service injection (see existing contribution)
4. Follow TypeScript strict mode

### Adding Features to Extension

1. Add to `extensions/mobileforge-core/src/`
2. Export from `extension.ts`
3. Register commands/views in `package.json`
4. Use VS Code Extension API

### Building & Testing

```bash
# Incremental build (faster)
npm run watch

# Full clean build
npm run compile

# Run tests
npm run test

# Launch extension development host
Press F5 in VS Code
```

---

## 🎨 UI Customization Roadmap

### Custom Theme Variables

```jsonc
// Future: src/vs/workbench/contrib/mobileforge/browser/theme.ts
{
  "colors": {
    "mobileforge.primary": "#667eea",      // Purple
    "mobileforge.secondary": "#764ba2",    // Deep purple
    "mobileforge.accent": "#60d9fa",       // Cyan
    "mobileforge.success": "#4CAF50",      // Green
    "mobileforge.warning": "#FF9800",      // Orange
    "mobileforge.error": "#F44336"         // Red
  }
}
```

### Activity Bar Customization

Replace default icons with mobile-focused ones:
- Explorer → Flutter Projects
- Search → Widget Search
- Source Control → Git (keep)
- Run & Debug → Devices & Emulators
- Extensions → MobileForge Extensions

---

## 📚 Resources

### VS Code Architecture
- [VS Code Source Code Guide](https://github.com/microsoft/vscode/wiki/Source-Code-Organization)
- [Workbench Services](https://github.com/microsoft/vscode/wiki/Services)
- [Contribution Points](https://code.visualstudio.com/api/references/contribution-points)

### Our PRD
- [MobileForge-IDE-PRD.md](MobileForge-IDE-PRD.md) - Complete product definition

### Similar Projects
- [Cursor](https://cursor.sh) - AI-first VS Code fork
- [Zed](https://zed.dev) - Performance-focused editor
- [Android Studio](https://developer.android.com/studio) - Mobile IDE reference

---

## ❓ FAQ

### Q: Why fork VS Code instead of making an extension?
**A:** Extensions are limited by the Extension API. Forking gives us:
- Custom UI/UX (themes, layouts, welcome screens)
- Tighter AI integration (inline completions in core)
- Bundle Flutter SDK without user setup
- Full control over the development workflow

### Q: Will we stay compatible with VS Code extensions?
**A:** Yes! We maintain the Extension API, so regular VS Code extensions work. We also bundle our own extensions for Flutter-specific features.

### Q: How do we handle VS Code updates?
**A:** We'll periodically merge upstream changes from microsoft/vscode. This is standard for forks (Cursor does this too).

### Q: Can users install their own Flutter SDK?
**A:** Yes, but it's not required. MobileForge bundles Flutter, but respects system Flutter if present.

---

## 🔥 Quick Commands Reference

```bash
# Development
npm run watch              # Auto-recompile on changes
npm run compile            # Full build
./scripts/code.sh          # Launch MobileForge IDE

# Testing
npm run test              # Run all tests
npm run test-browser      # Browser tests
npm run test-node         # Node tests

# Cleanup
npm run clean             # Clean build artifacts
npm run monaco-typecheck  # Type check
```

---

*Last Updated: December 3, 2025*
*Author: Smith (with Claude)*
