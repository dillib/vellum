# Vellum Browser

**AI-powered browser with decentralized sync**

## Project Structure

```
vellum-browser/
├── desktop/          # Electron + React desktop app
├── icp/              # Internet Computer canisters (auth, sync)
├── shared/           # Shared types, utilities, constants
├── docs/             # Architecture, design, specs
└── README.md
```

## Tech Stack

### Desktop App
- **Framework:** Electron + React + TypeScript
- **UI:** Tailwind CSS + Radix UI
- **State:** Zustand
- **AI:** Embedded Clawdbot Gateway
- **Browser Engine:** Chromium (via Electron)

### ICP Backend
- **Language:** Motoko (for canisters)
- **Auth:** Internet Identity
- **Storage:** Encrypted settings/bookmarks/history
- **Sync:** Cross-device real-time sync

### Shared
- **TypeScript** types and utilities
- **Zod** schemas for validation
- Shared constants and configs

## Development Phases

### Phase 1: Desktop MVP (Current)
- [x] Project structure
- [ ] Electron boilerplate
- [ ] Basic browser shell (tabs, navigation)
- [ ] AI assistant panel (split view)
- [ ] Clawdbot integration

### Phase 2: ICP Integration
- [ ] Canister setup (auth, storage, sync)
- [ ] Internet Identity integration
- [ ] Encrypted sync protocol
- [ ] Cross-device testing

### Phase 3: Polish & Launch
- [ ] UI/UX refinement
- [ ] Performance optimization
- [ ] Beta testing
- [ ] Public release

## Models Used
- **Claude Opus 4.5:** Architecture, complex logic
- **GLM-4 Flash:** Boilerplate, implementation
- **Claude Sonnet 4.5:** Coordination, iteration

## Getting Started

```bash
# Desktop app
cd desktop
npm install
npm run dev

# ICP canisters (coming soon)
cd icp
dfx start --background
dfx deploy
```

## Design Principles

1. **Zero Learning Curve** - Familiar browser experience
2. **AI is Optional** - Works great without AI, amazing with it
3. **Privacy First** - User owns their data
4. **Beautiful by Default** - Dark mode, smooth animations
5. **Fast & Lightweight** - No bloat

## License
TBD

## Contributors
- Built with Clawdbot
