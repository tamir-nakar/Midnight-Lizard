# Midnight Chameleon 🦎🌙

> **A revival fork of the original Midnight Lizard extension with Manifest V3 support**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-green.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)

## 🔥 Revival Notice

**Midnight Chameleon** is a community-maintained revival of the original **Midnight Lizard** extension, created by Pavel Agarkov. The original extension is no longer actively maintained, so we've forked it to:

- ✅ **Modernize for Manifest V3** (Chrome's new extension platform)
- ✅ **Fix compatibility issues** with modern browsers
- ✅ **Continue development** and bug fixes
- ✅ **Maintain the beloved dark theme functionality**

## 🎨 What it does

Transform any website into a dark, customizable theme that's easy on your eyes. Perfect for night browsing, reducing eye strain, and creating a consistent dark experience across the web.

### Features:
- 🌙 **Universal dark mode** for any website
- 🎨 **Fully customizable** colors, brightness, contrast
- ⚡ **Fast and lightweight**
- 🔧 **Per-site settings** with whitelist/blacklist
- 🎯 **Smart detection** of existing dark themes
- 📱 **Works on all sites** - social media, docs, news, etc.

## 📦 Installation

### Chrome Web Store
*Coming soon - pending approval*

### Manual Installation (Development)
1. Download or clone this repository
2. Run `npm install && npm run prod-build`
3. Open Chrome → Extensions → Enable "Developer mode"
4. Click "Load unpacked" → Select the project folder
5. Enjoy your dark web experience! ��

## 🔧 Development Setup

For fast development with instant builds on file changes:

```bash
# Standard development build with full source maps
npm run watch

# Ultra-fast development build (minimal debugging info)
npm run watch-fast
```

The new nodemon-based watch system automatically rebuilds when you save TypeScript files, providing instant feedback during development.

### Available Scripts

- `npm run build-dev` - Development build with full source maps (~2-3s)
- `npm run build-fast` - Ultra-fast build with minimal debugging (~0.5s)
- `npm run watch` - Watch mode using `build-dev` (recommended)
- `npm run watch-fast` - Watch mode using `build-fast` (for rapid iteration)
- `npm run dev-build` - Development build with bundle analyzer
- `npm run prod-build` - Production build (optimized)
- `npm run prod-pack` - Build and package for Chrome + Firefox

### Development Workflow

1. **Start development**: `npm run watch`
2. **Make changes** to TypeScript files in `ts/` directory
3. **See instant builds** triggered automatically by nodemon
4. **Load extension** in Chrome for testing

## 🛡️ Security & CSP Compliance

This extension is fully compliant with modern Content Security Policy (CSP) requirements:

### ✅ CSP-Safe Features:
- **No inline script injection** - Uses `chrome.scripting` API instead of creating `<script>` elements
- **Safe HTML parsing** - Uses `DOMParser` instead of `innerHTML` for user content
- **Proper script worlds** - Page scripts injected into `MAIN` world context
- **Permission-based injection** - All script injection requires proper browser permissions

### 🔧 Troubleshooting CSP Errors

If you see CSP-related errors in the console:

1. **"script-src 'self'" violations**: These should be resolved by our Manifest V3 implementation
2. **"Refused to execute inline script"**: The extension no longer uses inline scripts
3. **Connection errors**: Ensure the extension has proper permissions in `chrome://extensions/`

### 🔄 If You Still See Errors:

1. **Reload the extension**: Go to `chrome://extensions/` → Click "Reload" on Midnight Chameleon
2. **Refresh the page**: CSP violations from old script injections will clear
3. **Check permissions**: Ensure "Allow access to file URLs" is enabled if needed

---

```bash
# Install dependencies
npm install

# Development build with hot reload
npm run watch

# Production build
npm run prod-build

# Build extension packages
npm run prod-pack
```

## 📜 Legal & Attribution

### Original Work
This project is based on **Midnight Lizard** by Pavel Agarkov:
- Original Repository: [Midnight-Lizard/Midnight-Lizard](https://github.com/Midnight-Lizard/Midnight-Lizard)
- Original Author: Pavel Agarkov (support@midnight-lizard.org)
- Original License: MIT

### This Fork
- **License**: MIT (same as original)
- **Maintainer**: Midnight Chameleon Team
- **Purpose**: Revival and modernization of the original extension
- **Changes**: Manifest V3 migration, bug fixes, continued development

We are **not affiliated** with the original author but maintain this fork with respect and gratitude for their excellent work.

## 🤝 Contributing

We welcome contributions! Since the original project is no longer maintained, this fork serves as the community hub for:

- 🐛 Bug fixes
- ✨ New features  
- 🔧 Browser compatibility
- 📚 Documentation
- 🌍 Translations

## 💖 Support the Project

If this extension helps you, consider:
- ⭐ **Star this repository**
- 🐛 **Report bugs** and suggest features
- 💻 **Contribute code** improvements
- ☕ **Buy us a coffee** *(coming soon)*

## 📝 Changelog

### v10.7.0 - Revival Release
- 🚀 **Forked from original Midnight Lizard**
- ✅ **Migrated to Manifest V3** for Chrome compatibility
- 🔧 **Fixed Node.js build issues** with modern environments
- 📦 **Updated dependencies** and build process
- 🎨 **Rebranded as Midnight Chameleon**

---

**Made with 💙 by the community, inspired by Pavel Agarkov's original vision**
