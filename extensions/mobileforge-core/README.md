# MobileForge Core Extension

The heart of MobileForge IDE - an AI-powered extension that brings Flutter-first development to VS Code.

## Features

### 🎉 Welcome Experience
- Beautiful Flutter-focused welcome screen
- Quick actions to create new projects or open existing ones
- One-click environment health checks

### 🔧 Environment Health Monitoring
- Real-time status of Flutter SDK
- Dart SDK verification
- Android SDK detection
- iOS toolchain validation
- One-click fixes for common issues (coming soon)

### 🤖 AI Integration (Coming Soon)
- Flutter-specialized code completion
- Widget generation from natural language
- State management pattern recognition
- Refactoring suggestions

### 🎨 Figma Integration (Coming Soon)
- Convert Figma designs to Flutter widgets
- Design token extraction
- Theme generation from design systems

## Development

### Setup
```bash
cd extensions/mobileforge-core
npm install
npm run compile
```

### Watch Mode
```bash
npm run watch
```

### Project Structure
```
src/
├── ai/              # AI integration (coming soon)
├── figma/           # Figma-to-Flutter converter (coming soon)
├── flutter/         # Flutter tooling
│   └── environmentHealth.ts
├── deploy/          # Deployment wizards (coming soon)
└── ui/              # Custom UI components
    └── welcomeView.ts
```

## Roadmap

See [MobileForge-IDE-PRD.md](../../../MobileForge-IDE-PRD.md) for the complete development roadmap.

### Phase 1: Foundation (Current)
- [x] Extension structure
- [x] Welcome experience
- [x] Environment health panel
- [ ] Flutter SDK bundling
- [ ] Basic AI integration

### Phase 2: Core Features
- [ ] Advanced AI code assistant
- [ ] Figma-to-Flutter converter
- [ ] Widget tree visualizer
- [ ] Asset browser

### Phase 3: Advanced Features
- [ ] Deployment wizard
- [ ] Team collaboration features
- [ ] Documentation generation

## Contributing

This is part of the MobileForge IDE project. See the main README for contributing guidelines.

## License

MIT
