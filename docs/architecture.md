# Vellum Browser - Technical Architecture

## Overview

Vellum is a hybrid AI-powered browser combining local desktop performance with decentralized cloud sync via Internet Computer (ICP).

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                      │
│  ┌──────────────────┐           ┌─────────────────────┐    │
│  │  Web Content     │           │  AI Assistant       │    │
│  │  (BrowserView)   │◄─────────►│  (React Component)  │    │
│  │  - Chromium      │  Context  │  - Chat Interface   │    │
│  │  - Page Render   │  Sharing  │  - Page Actions     │    │
│  └──────────────────┘           └─────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                          ▲
                          │ IPC (WebSocket)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer (Electron Main)          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Window Mgmt  │  │  Tab Manager │  │ Settings     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Clawdbot     │  │  Local Store │  │ ICP Client   │     │
│  │ Gateway      │  │  (SQLite)    │  │ (Sync)       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                          ▲
                          │ HTTPS/IC Protocol
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Internet Computer (ICP Network)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Identity    │  │  Storage     │  │  Sync        │     │
│  │  Canister    │  │  Canister    │  │  Canister    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Desktop Application

**Framework:** Electron v28+
- **Main Process:** Node.js (window management, native APIs)
- **Renderer Process:** React 18 + TypeScript
- **Build Tool:** Vite 5
- **Browser Engine:** Chromium (via Electron BrowserView)

**UI Framework:**
- **Styling:** Tailwind CSS 3.4
- **Components:** Radix UI (accessible primitives)
- **Design System:** shadcn/ui patterns
- **Animations:** Framer Motion
- **Icons:** Lucide React

**State Management:**
- **Global State:** Zustand (lightweight, performant)
- **Server State:** TanStack Query (data fetching/caching)
- **Form State:** React Hook Form + Zod validation

**Local Storage:**
- **Browser Data:** SQLite (history, bookmarks, cache)
- **Settings:** JSON files (quick access)
- **Session State:** IndexedDB (crash recovery)

### AI Integration

**Clawdbot Gateway:**
- Embedded Node.js server in Electron main process
- WebSocket IPC to renderer
- Model router (Opus for reasoning, GLM-Flash for speed)

**Capabilities:**
- Page interaction (snapshot, act, click, type)
- Content extraction (text, images, forms)
- Context-aware assistance
- Multi-step automation

### ICP Backend

**Language:** Motoko
**Canisters:**

1. **Identity Canister**
   - Internet Identity integration
   - User authentication
   - Principal management

2. **Storage Canister**
   - Encrypted settings (AES-256)
   - Bookmarks (folder structure)
   - History (privacy-preserving)
   - Extensions/themes

3. **Sync Canister**
   - Real-time device sync
   - Conflict resolution (CRDTs)
   - Delta updates (bandwidth optimization)

**Security:**
- End-to-end encryption (client-side)
- Zero-knowledge sync (server can't read data)
- Device attestation

## Data Models

### Local (SQLite)

```sql
-- Tabs
CREATE TABLE tabs (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT,
  favicon TEXT,
  created_at INTEGER,
  last_active INTEGER
);

-- History
CREATE TABLE history (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT,
  visit_time INTEGER,
  visit_count INTEGER DEFAULT 1,
  INDEX idx_url (url),
  INDEX idx_time (visit_time)
);

-- Bookmarks
CREATE TABLE bookmarks (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT,
  folder_id TEXT,
  position INTEGER,
  created_at INTEGER,
  FOREIGN KEY(folder_id) REFERENCES folders(id)
);

-- Settings
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at INTEGER
);
```

### ICP (Motoko Types)

```motoko
type UserId = Principal;

type EncryptedData = {
  ciphertext: Blob;
  nonce: Blob;
  tag: Blob;
};

type Bookmark = {
  id: Text;
  url: Text;
  title: Text;
  folder: ?Text;
  created: Int;
};

type SyncPayload = {
  userId: UserId;
  deviceId: Text;
  timestamp: Int;
  data: EncryptedData;
  checksum: Text;
};
```

## UI/UX Design

### Layout

**Split View (default):**
- **Left (60-80%):** Web content (BrowserView)
- **Right (20-40%):** AI assistant (resizable, collapsible)

**Compact Mode:**
- AI assistant collapses to edge panel
- Expands on hover or keyboard shortcut

**Full-screen:**
- AI assistant accessible via overlay (Cmd/Ctrl+K)

### Navigation Bar

```
┌──────────────────────────────────────────────────────┐
│ [←] [→] [↻]  🔒 example.com                    [⚙︎] │
└──────────────────────────────────────────────────────┘
```

- Minimal chrome (Arc-inspired)
- Address bar doubles as search
- Tab strip (top or side, user preference)

### AI Assistant Panel

```
┌─────────────────────────┐
│  💬 Chat                │
│  ─────────────────────  │
│  User: Summarize this   │
│  page                   │
│                         │
│  AI: This article...    │
│                         │
│  [Type a message...]    │
│                         │
│  Quick Actions:         │
│  • Fill form            │
│  • Extract data         │
│  • Translate page       │
└─────────────────────────┘
```

### Theme

**Dark Mode (default):**
- Background: `#0a0a0a`
- Surface: `#1a1a1a`
- Border: `#2a2a2a`
- Text: `#e0e0e0`
- Accent: `#3b82f6` (blue)

**Light Mode:**
- Background: `#ffffff`
- Surface: `#f5f5f5`
- Border: `#e0e0e0`
- Text: `#1a1a1a`
- Accent: `#2563eb`

## Performance Targets

- **Cold Start:** <2 seconds
- **Tab Switch:** <100ms
- **Page Load:** Chromium native speed
- **AI Response:** <3 seconds (first token)
- **Memory:** <500MB baseline
- **CPU:** <5% idle

## Security

### Browser Security
- Sandboxed renderer processes
- Content Security Policy (CSP)
- HTTPS-only by default
- Certificate validation

### AI Security
- Local model inference (optional)
- Prompt injection protection
- User consent for actions
- Audit log of AI actions

### ICP Security
- End-to-end encryption
- Zero-knowledge architecture
- Device-based auth
- Regular security audits

## Development Workflow

### Local Development

```bash
# Desktop app
cd desktop
npm install
npm run dev        # Hot reload
npm run build      # Production build
npm run test       # Unit tests

# ICP canisters
cd icp
dfx start --background
dfx deploy --network=local
dfx canister call storage get_bookmarks
```

### Deployment

**Desktop:**
- Electron Forge (packaging)
- Auto-update via ICP canister
- Multi-platform builds (Windows/Mac/Linux)

**ICP:**
- `dfx deploy --network=ic`
- Canister upgrades (preserving state)
- Monitoring via ICP dashboard

## Roadmap

### Phase 1: Desktop MVP (4-6 weeks)
- ✅ Project setup
- [ ] Browser shell + tab management
- [ ] AI assistant integration
- [ ] Basic UI/UX
- [ ] Local storage

### Phase 2: ICP Integration (3-4 weeks)
- [ ] Canister development
- [ ] Internet Identity
- [ ] Encrypted sync
- [ ] Multi-device testing

### Phase 3: Polish (2-3 weeks)
- [ ] Performance optimization
- [ ] Keyboard shortcuts
- [ ] Extension system
- [ ] Beta release

### Phase 4: Mobile (Future)
- [ ] React Native wrapper
- [ ] iOS app
- [ ] Android app
- [ ] Gesture controls

## Open Questions

1. **Extension compatibility:** Support Chrome extensions?
2. **Privacy mode:** Local-only mode without ICP sync?
3. **AI model hosting:** Cloud fallback for heavy models?
4. **Monetization:** Free tier + premium features?

---

**Last Updated:** 2026-02-14  
**Status:** Architecture defined, implementation starting
