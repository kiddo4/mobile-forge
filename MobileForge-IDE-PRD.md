# MobileForge IDE — Project Definition Document

> An AI-native IDE purpose-built for mobile development, starting with Flutter-first support.

---

## 1. Vision & Mission

**Vision:** Become the definitive development environment for mobile developers by eliminating every friction point between idea and deployed app.

**Mission:** Build an AI-powered IDE on top of VS Code that understands mobile development deeply—not as a general-purpose editor with plugins, but as a tool designed from the ground up for mobile workflows.

**Core Philosophy:**
- Zero-config development: Open the IDE, start coding Flutter immediately
- AI that understands mobile context: Not generic code completion, but mobile-aware intelligence
- End-to-end workflow: From Figma design to App Store deployment, all in one place

---

## 2. Target Users

**Primary:** Flutter developers (Phase 1)
- Beginners who struggle with environment setup
- Intermediate developers who want faster workflows
- Teams who need consistent development environments

**Secondary (Future Phases):**
- React Native developers
- Native iOS/Android developers
- Cross-platform teams

---

## 3. Core Problems We Solve

### 3.1 Environment Setup Hell
**Problem:** New Flutter developers spend hours/days configuring Dart SDK, Flutter SDK, Android Studio, Xcode, emulators, and dealing with PATH issues.

**Solution:**
- Bundled Flutter SDK (latest stable, auto-updated)
- Pre-configured Dart analysis server
- Embedded Android emulator management
- iOS simulator integration (on macOS)
- One-click environment validation ("Doctor" built-in)

### 3.2 Design-to-Code Gap
**Problem:** Converting Figma designs to Flutter widgets is manual, tedious, and error-prone.

**Solution:**
- Figma plugin/integration that exports design tokens
- AI-powered Figma-to-Widget converter
- Style guide synchronization (colors, typography, spacing)
- Component library generation from design systems

### 3.3 Generic AI Assistance
**Problem:** Current AI tools (Copilot, Cursor) are general-purpose—they don't understand Flutter idioms, widget trees, state management patterns, or mobile-specific concerns.

**Solution:**
- Flutter-specialized AI model fine-tuning/prompting
- Context-aware suggestions (knows you're in a StatefulWidget vs StatelessWidget)
- State management pattern recognition (BLoC, Riverpod, Provider)
- Platform-specific code generation (iOS vs Android handling)
- Widget composition intelligence

### 3.4 Mobile-Specific Debugging Pain
**Problem:** Debugging on devices, hot reload issues, platform channel problems, performance profiling scattered across tools.

**Solution:**
- Integrated DevTools (not external browser)
- Visual widget inspector in-editor
- Platform channel debugging
- Performance overlay controls
- Crash log aggregation from devices

### 3.5 Deployment Complexity
**Problem:** Building for App Store and Play Store requires managing certificates, provisioning profiles, signing keys, version bumping, and multiple CLI tools.

**Solution:**
- Guided deployment wizard
- Certificate/key management
- Automated version bumping
- Build configuration profiles
- CI/CD template generation

---

## 4. Feature Specification

### 4.1 Phase 1: Flutter Foundation (MVP)

#### 4.1.1 Zero-Config Environment
```
Priority: P0 (Must Have)
Complexity: High
```

**Requirements:**
- [ ] Bundle Flutter SDK (latest stable) with IDE installation
- [ ] Auto-detect and configure Dart SDK
- [ ] Embedded Android SDK manager (download on demand)
- [ ] iOS toolchain detection (Xcode, CocoaPods)
- [ ] Environment health dashboard (like `flutter doctor` but visual)
- [ ] One-click fix for common environment issues
- [ ] Isolated environment (doesn't conflict with system Flutter)

**Technical Approach:**
- Use VS Code's extension host for Flutter/Dart extensions
- Bundle Flutter SDK in app resources
- Create custom "Environment Manager" panel
- Shell out to Flutter CLI but wrap with better UX

#### 4.1.2 AI Code Assistant (Flutter-Specialized)
```
Priority: P0 (Must Have)
Complexity: High
```

**Requirements:**
- [ ] Inline code completion (Flutter-aware)
- [ ] Chat interface for code questions
- [ ] Code generation from natural language
- [ ] Refactoring suggestions (extract widget, convert to StatefulWidget)
- [ ] Error explanation and fixes
- [ ] Widget suggestion based on context
- [ ] Import auto-management

**AI Context Awareness:**
- Current file type (widget, model, service, test)
- Project structure (lib/, test/, assets/)
- State management pattern in use
- Target platforms configured
- Pubspec dependencies
- Widget tree position

**Example Interactions:**
```
User: "Create a card that shows user profile with avatar, name, and email"
AI: Generates ProfileCard widget with proper Flutter idioms, null safety, const constructors

User: "Make this list scrollable with pull to refresh"
AI: Wraps existing ListView with RefreshIndicator, adds controller, generates refresh callback

User: "Add BLoC for authentication"
AI: Generates auth_bloc.dart, auth_event.dart, auth_state.dart with proper patterns
```

#### 4.1.3 Figma-to-Flutter Converter
```
Priority: P1 (Should Have)
Complexity: High
```

**Requirements:**
- [ ] Figma plugin for design export
- [ ] Design token extraction (colors, typography, spacing)
- [ ] Component-to-Widget mapping
- [ ] Layout analysis (Flex, Stack, positioning)
- [ ] Asset export (images, icons as Flutter assets)
- [ ] Theme generation from design system
- [ ] Interactive preview before code generation

**Conversion Pipeline:**
```
Figma Design
    ↓
[Figma Plugin] — Exports JSON structure + assets
    ↓
[MobileForge Parser] — Analyzes layout hierarchy
    ↓
[AI Widget Mapper] — Determines best Flutter widgets
    ↓
[Code Generator] — Produces clean, idiomatic Flutter code
    ↓
[User Review] — Preview and adjust before inserting
    ↓
Project Files (widgets, theme, assets)
```

**Supported Figma Elements:**
- Frames → Container, SizedBox, or layout widgets
- Auto Layout → Row, Column, Wrap with proper alignment
- Text → Text widget with TextStyle
- Images → Image.asset or Image.network
- Icons → Icon widget or SvgPicture
- Components → Extracted as reusable widgets
- Variants → Widget parameters or separate widgets

#### 4.1.4 Enhanced Editor Features
```
Priority: P0 (Must Have)
Complexity: Medium
```

**Requirements:**
- [ ] Widget tree visualizer (sidebar showing hierarchy)
- [ ] Color picker for Flutter Color values
- [ ] Padding/margin visual editor
- [ ] Asset browser (images, fonts in project)
- [ ] Pubspec.yaml visual editor
- [ ] Snippet library (common Flutter patterns)
- [ ] Quick actions (wrap with widget, extract, etc.)

#### 4.1.5 Integrated Preview & Testing
```
Priority: P1 (Should Have)
Complexity: Medium
```

**Requirements:**
- [ ] Built-in device preview (multiple screen sizes)
- [ ] Hot reload status indicator
- [ ] Screenshot capture
- [ ] Widget test runner with visual output
- [ ] Golden test comparison viewer
- [ ] Integration test recorder

---

### 4.2 Phase 2: Advanced AI Features

#### 4.2.1 Conversational App Building
```
Priority: P1
```
- Build entire screens through conversation
- "Create a settings page with theme toggle, notification preferences, and account section"
- Iterative refinement: "Make the toggles more prominent" → AI updates code

#### 4.2.2 Code Review & Optimization
```
Priority: P2
```
- Performance analysis (unnecessary rebuilds, heavy widgets)
- Accessibility audit
- Best practices linting (beyond standard lint rules)
- Security scanning (API keys, insecure storage)

#### 4.2.3 Documentation Generation
```
Priority: P2
```
- Auto-generate widget documentation
- README creation for packages
- API documentation for services
- Onboarding guides for new team members

---

### 4.3 Phase 3: Team & Deployment Features

#### 4.3.1 Deployment Wizard
```
Priority: P1
```
- iOS: Certificate management, provisioning profiles, App Store Connect
- Android: Keystore management, Play Console setup
- Guided first-time setup
- Build & upload automation

#### 4.3.2 Team Collaboration
```
Priority: P2
```
- Shared AI context (team coding standards)
- Code review integration
- Shared snippet libraries
- Project templates

### 4.4 UI/UX Customization Phase
```
Priority: P0 (Must Have)
Timeline: Weeks 1-4 (overlaps Phase 1)
```

**Goals:**
- Establish a MobileForge visual identity across the forked VS Code surfaces
- Reduce cognitive load for Flutter-first workflows with opinionated defaults and layouts
- Make AI and environment health surfaces discoverable without increasing UI noise
- Keep accessibility and performance on par with upstream VS Code

**Design Principles:**
- Mobile-first mindset: device previews, platform targets, and Flutter concepts are foregrounded
- Clarity over density: prioritize the most common workflows (setup, code, preview, deploy)
- Guided actions: every warning/error state offers a single primary fix path
- Familiar-but-fresh: preserve core VS Code ergonomics while differentiating branding and flows

**Key UI Surfaces to Customize:**
- Welcome & Onboarding Hub
  - [ ] Branded welcome screen with quick actions (New Flutter Project, Open, Clone)
  - [ ] Inline environment health card (Doctor status, one-click fixes, emulator/simulator launch)
  - [ ] Short tour for AI, Figma import, and device preview entry points
- Workbench Theming & Navigation
  - [ ] MobileForge color system, typography, and icon set applied to `product.json`/resources
  - [ ] Activity Bar icons reworked for mobile workflows (Devices, Figma, Deploy, AI)
  - [ ] Default layout preset: Explorer + AI Chat + Environment panel visible on first run
- Environment Health Panel (visual "Doctor")
  - [ ] Status states with severity color-coding and progress indicators
  - [ ] Batch "Fix All" and per-issue quick actions with inline explanations
  - [ ] Persistent toast for blocking issues (e.g., missing Xcode) with deep links to steps
- AI Surfaces
  - [ ] Dockable chat panel with mobile-aware prompt shortcuts (Widget, State, Platform, Performance)
  - [ ] Inline code actions annotated as "MobileForge AI" with minimal chrome
  - [ ] Context chips showing active targets (iOS/Android/Web), state management, and selected device
- Figma-to-Flutter Review
  - [ ] Side-by-side preview (design vs generated widget) with change highlights
  - [ ] Token diff view (colors/typography/spacing) and apply/rollback controls
  - [ ] Generation summary with quality checks (layout fit, assets linked)
- Device Preview & Testing
  - [ ] Device tray with common presets + custom sizes; quick orientation toggle
  - [ ] Hot reload status + error surface near preview, not hidden in console
  - [ ] Screenshot/golden capture buttons with save location chooser
- Deployment Wizard UX
  - [ ] Stepper UI with platform-specific requirements checklist
  - [ ] Credential vault UI for keys/certs with validation chips
  - [ ] Progress + logs with retry/resume states; celebratory end-screen with next steps

**Deliverables & Acceptance Criteria:**
- [ ] Updated design tokens (color, type, spacing) and iconography stored in resources/branding
- [ ] High-fidelity mocks/prototypes for each key surface with mobile-first defaults
- [ ] Implemented welcome view, environment panel UI, and initial theming wired in `product.json`
- [ ] Usability pass: first-run setup flow validated with at least 5 internal users (record friction points)
- [ ] Performance parity: UI changes do not degrade startup beyond +200ms on target hardware

**Dependencies & Risks:**
- Relies on branded assets delivery (logo, colors, icon set)
- Needs SDK detection scaffolding to power live states in Environment panel
- AI shortcut chips depend on context builder emitting platform/state metadata

**Success Metrics:**
- Time to first successful Flutter run (new user): < 10 minutes
- % of users who discover AI chat + environment panel in first session: > 80%
- SUS score for setup + preview flows: > 80

**Interim Visual System (no assets yet):**
- Palette (working defaults): Primary `#2563EB` (blue), Accent `#7C3AED` (purple), Success `#10B981`, Warning `#F59E0B`, Error `#EF4444`, Surfaces `#0B1220` (darker panels) + `#0F172A` (main background), Border `#1E293B`, Text `#E2E8F0`/`#94A3B8` for secondary
- Typography: "Space Grotesk", fallback "Inter", then system sans; code uses existing VS Code monospace stack
- Density: 12px base spacing grid; surface padding 16px; corner radius 8px for panels/buttons, 4px for chips
- Motion: 120ms ease for hover/focus; 200ms for panel reveal; reduce motion respects OS prefers-reduced-motion
- Iconography: continue using VS Code outline icons; recolor with primary/neutral tokens until custom set arrives
- Layout defaults: first-run layout with Activity Bar on left, AI Chat docked right, Environment panel bottom; expose "Reset to MobileForge Layout" in Command Palette
- Documentation: capture tokens in `resources/branding/tokens.json` (to be created) and reference in `product.json` theme entries once assets arrive

---

## 5. Technical Architecture

### 5.1 Base: VS Code Fork
```
Repository: microsoft/vscode (fork)
Approach: Modify, rebrand, extend
```

**Modifications Required:**
- Branding (name, icons, splash screen, about)
- Default extensions (pre-install Flutter, Dart)
- Custom welcome experience
- Modified settings defaults for mobile dev
- Custom activity bar icons
- Themed for mobile development context

### 5.2 Core Components

```
┌─────────────────────────────────────────────────────────┐
│                    MobileForge IDE                       │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │   Editor    │  │  AI Engine  │  │  Flutter Tools  │ │
│  │  (VS Code)  │  │   Service   │  │    Service      │ │
│  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘ │
│         │                │                   │          │
│         └────────────────┼───────────────────┘          │
│                          │                              │
│  ┌───────────────────────┴───────────────────────────┐ │
│  │              Extension Host                        │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │ │
│  │  │  Dart   │ │ Flutter │ │  Figma  │ │ Deploy  │ │ │
│  │  │  Ext    │ │   Ext   │ │ Bridge  │ │ Wizard  │ │ │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │           Bundled Runtime Environment              │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────────────────┐ │ │
│  │  │ Flutter │ │  Dart   │ │  Android SDK (lazy) │ │ │
│  │  │   SDK   │ │   SDK   │ │                     │ │ │
│  │  └─────────┘ └─────────┘ └─────────────────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 5.3 AI Integration Architecture

```
┌──────────────────┐
│   User Action    │
│ (code, chat, etc)│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Context Builder │ ← Gathers: file content, cursor position,
│                  │   project structure, dependencies,
│                  │   recent edits, error messages
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Prompt Engine   │ ← Flutter-specific system prompts
│                  │   Task-specific templates
│                  │   Few-shot examples for Flutter
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   LLM Backend    │ ← Options:
│                  │   - Claude API (primary)
│                  │   - OpenAI API (fallback)
│                  │   - Local models (future)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Response Parser  │ ← Extract code blocks
│                  │   Validate Flutter syntax
│                  │   Format for insertion
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Editor Action   │ ← Insert code, show diff,
│                  │   apply refactoring
└──────────────────┘
```

### 5.4 Figma Integration Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Figma                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │           MobileForge Figma Plugin               │   │
│  │                                                   │   │
│  │  • Select frames/components                      │   │
│  │  • Export as structured JSON                     │   │
│  │  • Extract assets (images, icons)                │   │
│  │  • Capture design tokens                         │   │
│  └─────────────────────┬───────────────────────────┘   │
└─────────────────────────┼───────────────────────────────┘
                          │ HTTPS / WebSocket
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   MobileForge IDE                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Figma Bridge Extension              │   │
│  │                                                   │   │
│  │  • Receive design data                           │   │
│  │  • Parse layout hierarchy                        │   │
│  │  • Map to Flutter widgets (AI-assisted)          │   │
│  │  • Generate code                                 │   │
│  │  • Preview before insertion                      │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 6. File Structure (VS Code Fork)

```
mobileforge-ide/
├── .vscode/                    # Dev settings
├── build/                      # Build output
├── extensions/                 # Built-in extensions
│   ├── mobileforge-core/       # Core MobileForge features
│   │   ├── src/
│   │   │   ├── ai/            # AI integration
│   │   │   │   ├── contextBuilder.ts
│   │   │   │   ├── promptEngine.ts
│   │   │   │   ├── llmClient.ts
│   │   │   │   └── responseParser.ts
│   │   │   ├── figma/         # Figma integration
│   │   │   │   ├── bridge.ts
│   │   │   │   ├── parser.ts
│   │   │   │   └── widgetMapper.ts
│   │   │   ├── flutter/       # Flutter tooling
│   │   │   │   ├── sdkManager.ts
│   │   │   │   ├── projectAnalyzer.ts
│   │   │   │   └── widgetTree.ts
│   │   │   ├── deploy/        # Deployment features
│   │   │   │   ├── iosDeployer.ts
│   │   │   │   ├── androidDeployer.ts
│   │   │   │   └── wizard.ts
│   │   │   └── ui/            # Custom UI components
│   │   │       ├── welcomeView.ts
│   │   │       ├── envHealthPanel.ts
│   │   │       └── widgetPreview.ts
│   │   └── package.json
│   ├── dart/                   # Bundled Dart extension (modified)
│   └── flutter/                # Bundled Flutter extension (modified)
├── resources/
│   ├── flutter-sdk/            # Bundled Flutter SDK
│   ├── android-sdk/            # Android SDK components (lazy load)
│   └── branding/               # Icons, splash screens
├── src/
│   └── vs/                     # VS Code source (modified)
│       ├── workbench/
│       │   └── contrib/
│       │       └── mobileforge/  # Custom workbench contributions
│       └── ... (standard VS Code structure)
├── product.json                # Branding configuration
├── package.json
└── README.md
```

---

## 7. Development Roadmap

### Phase 1: Foundation (Months 1-3)

**Month 1: Setup & Branding**
- [ ] Fork VS Code repository
- [ ] Set up build pipeline
- [ ] Rebrand (name, icons, colors)
- [ ] Create custom welcome experience
- [ ] Bundle Flutter/Dart extensions

**Month 2: Environment Management**
- [ ] Bundle Flutter SDK
- [ ] Create environment health panel
- [ ] Implement one-click fixes
- [ ] Android SDK lazy loading
- [ ] iOS toolchain detection

**Month 3: Basic AI Integration**
- [ ] Set up AI service infrastructure
- [ ] Implement context builder
- [ ] Create Flutter-specific prompts
- [ ] Basic code completion
- [ ] Chat interface

### Phase 2: Core Features (Months 4-6)

**Month 4: Advanced AI**
- [ ] Refactoring suggestions
- [ ] Error explanation
- [ ] Code generation from description
- [ ] Widget-aware completions

**Month 5: Figma Integration**
- [ ] Figma plugin development
- [ ] Design JSON parser
- [ ] Widget mapping engine
- [ ] Code generation
- [ ] Preview UI

**Month 6: Polish & Testing**
- [ ] Widget tree visualizer
- [ ] Asset browser
- [ ] Performance optimization
- [ ] Beta testing
- [ ] Bug fixes

### Phase 3: Advanced Features (Months 7-9)

**Month 7: Deployment**
- [ ] iOS deployment wizard
- [ ] Android deployment wizard
- [ ] Certificate management

**Month 8: Team Features**
- [ ] Shared configurations
- [ ] Template system
- [ ] Documentation generation

**Month 9: Launch Prep**
- [ ] Marketing site
- [ ] Documentation
- [ ] Tutorial videos
- [ ] Launch campaign

---

## 8. Success Metrics

### User Acquisition
- Downloads: 10K in first 3 months
- Active users: 30% retention at 30 days
- Community: 1K Discord/Slack members

### User Satisfaction
- NPS: > 40
- GitHub stars: 5K in first year
- Feature request engagement

### Technical Performance
- IDE startup: < 5 seconds
- AI response: < 2 seconds (simple), < 10 seconds (complex)
- Figma conversion: < 30 seconds per component
- Zero-config success rate: > 95%

---

## 9. Competitive Analysis

| Feature | VS Code + Extensions | Android Studio | MobileForge |
|---------|---------------------|----------------|-------------|
| Zero Config Flutter | ❌ Manual setup | ❌ Manual setup | ✅ Bundled |
| Flutter-Specific AI | ⚠️ Generic | ❌ None | ✅ Specialized |
| Figma to Code | ❌ External tools | ❌ None | ✅ Built-in |
| Mobile Focus | ❌ General purpose | ⚠️ Android focus | ✅ Mobile first |
| Deployment Wizard | ❌ CLI only | ⚠️ Android only | ✅ Full wizard |

---

## 10. Monetization Strategy

### Freemium Model

**Free Tier:**
- Full IDE functionality
- Basic AI (limited requests/day)
- Community Figma templates
- Manual deployment

**Pro Tier ($15/month):**
- Unlimited AI requests
- Advanced Figma conversion
- Deployment automation
- Priority support
- Team features (5 seats)

**Team Tier ($10/user/month, min 5):**
- Everything in Pro
- Shared AI context
- Admin controls
- SSO integration
- Custom templates

---

## 11. Technical Decisions Log

| Decision | Options Considered | Choice | Rationale |
|----------|-------------------|--------|-----------|
| Base Editor | VS Code fork, Electron from scratch, Tauri | VS Code fork | Mature ecosystem, familiar UX, existing Flutter extension |
| AI Provider | OpenAI, Anthropic, Local LLM | Claude API (primary) | Superior code generation, better context handling |
| Figma Integration | Plugin only, API only, Both | Both (plugin + API) | Plugin for rich export, API for automation |
| SDK Bundling | System SDK, Bundled, Docker | Bundled (isolated) | Zero config, no conflicts, controlled updates |

---

## 12. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| VS Code license issues | Low | High | Use MIT-licensed fork, legal review |
| AI costs too high | Medium | Medium | Caching, rate limiting, optimize prompts |
| Figma API changes | Medium | Medium | Abstract integration, version pinning |
| Flutter SDK updates break bundling | Medium | Low | Automated testing, staged rollouts |
| Competition from JetBrains/Google | High | Medium | Focus on mobile-specific features, community |

---

## 13. Open Questions

1. **SDK Updates:** How to handle Flutter SDK updates? Auto-update vs manual?
2. **Offline AI:** Should we support local LLM fallback for offline use?
3. **Plugin Ecosystem:** Allow third-party extensions or curated only?
4. **Pricing:** Is freemium right, or should we go open-source with paid cloud features?
5. **Name:** Is "MobileForge" the final name? Alternatives?

---

## 14. Resources & References

### Technical
- [VS Code Source](https://github.com/microsoft/vscode)
- [Flutter SDK](https://github.com/flutter/flutter)
- [Dart Extension](https://github.com/Dart-Code/Dart-Code)
- [Figma Plugin API](https://www.figma.com/plugin-docs/)

### Inspiration
- [Cursor](https://cursor.sh) — AI-first editor approach
- [Zed](https://zed.dev) — Performance-focused editor
- [Fleet](https://www.jetbrains.com/fleet/) — Next-gen IDE concepts

### AI Integration
- [Anthropic Claude API](https://docs.anthropic.com)
- [OpenAI API](https://platform.openai.com/docs)
- [Continue.dev](https://continue.dev) — Open-source AI coding

---

## 15. Appendix: AI Prompt Templates

### Widget Generation Prompt
```
You are an expert Flutter developer. Generate a Flutter widget based on the following description.

Context:
- Project uses: {state_management_pattern}
- Target platforms: {platforms}
- Flutter version: {flutter_version}
- Existing imports available: {imports}

Requirements:
- Use const constructors where possible
- Follow Flutter style guide
- Include documentation comments
- Handle null safety properly
- Use appropriate widget composition

User Request: {user_description}

Generate the widget code:
```

### Figma-to-Flutter Prompt
```
Convert this Figma design structure to Flutter widgets.

Design JSON:
{figma_json}

Rules:
- Use Container for frames with decoration
- Use Row/Column for auto-layout
- Extract repeated patterns as separate widgets
- Use Theme.of(context) for colors when matching design system
- Prefer Expanded/Flexible over fixed sizes
- Use SizedBox for spacing (not Padding with empty children)

Generate Flutter code:
```

---

*Document Version: 1.0*
*Last Updated: {current_date}*
*Author: Smith*
