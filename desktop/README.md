# Vellum Browser - Desktop App

AI-powered browser built with Electron, React, and TypeScript.

## Features

✅ **Tab Management**
- Create, close, and switch between tabs
- Keyboard shortcuts (Cmd/Ctrl + T, W, Tab, 1-9)

✅ **Navigation**
- Back, forward, reload
- Smart address bar (search or navigate)
- HTTPS indicator

✅ **AI Assistant**
- Side panel with chat interface
- Quick actions (summarize, extract, translate)
- Toggle with Cmd/Ctrl + K

✅ **Modern UI**
- Dark mode by default
- Clean, minimal design (Arc/Safari inspired)
- Smooth animations

## Tech Stack

- **Electron** - Desktop framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Radix UI** - Accessible components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Build for all platforms
npm run electron:build
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + T` | New tab |
| `Cmd/Ctrl + W` | Close tab |
| `Cmd/Ctrl + Tab` | Next tab |
| `Cmd/Ctrl + Shift + Tab` | Previous tab |
| `Cmd/Ctrl + 1-9` | Switch to tab 1-9 |
| `Cmd/Ctrl + K` | Toggle AI panel |
| `Cmd/Ctrl + L` | Focus address bar |
| `Cmd/Ctrl + R` | Reload page |

## Project Structure

```
desktop/
├── electron/          # Electron main process
│   ├── main.ts       # Window management
│   └── preload.ts    # IPC bridge
├── src/
│   ├── components/   # React components
│   ├── hooks/        # Custom hooks
│   ├── stores/       # Zustand stores
│   ├── lib/          # Utilities
│   └── types/        # TypeScript types
└── package.json
```

## Development

### Hot Reload

Vite enables hot module replacement (HMR) for instant updates during development.

### Debugging

- **Renderer Process:** Use Chrome DevTools (auto-opens in dev mode)
- **Main Process:** Use VS Code debugger or `console.log`

## Roadmap

- [ ] Bookmarks manager
- [ ] History page
- [ ] Download manager
- [ ] Settings page
- [ ] Extensions support
- [ ] Sync via ICP
- [ ] Performance optimizations

## License

MIT
