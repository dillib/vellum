import { useState } from 'react'
import { X, Moon, Sun, Monitor, Search } from 'lucide-react'

interface SettingsProps {
  onClose: () => void
}

type Theme = 'dark' | 'light' | 'auto'
type SearchEngine = 'google' | 'bing' | 'duckduckgo'

export default function Settings({ onClose }: SettingsProps) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [searchEngine, setSearchEngine] = useState<SearchEngine>('google')
  const [aiEnabled, setAiEnabled] = useState(true)
  const [aiPanelWidth, setAiPanelWidth] = useState(400)

  const handleSave = () => {
    // TODO: Save settings to local storage or ICP
    console.log('Settings saved:', { theme, searchEngine, aiEnabled, aiPanelWidth })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Appearance */}
          <section>
            <h3 className="text-sm font-semibold mb-3">Appearance</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Theme
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      theme === 'light'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    <span className="text-sm">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      theme === 'dark'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    <span className="text-sm">Dark</span>
                  </button>
                  <button
                    onClick={() => setTheme('auto')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      theme === 'auto'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    <span className="text-sm">Auto</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Search */}
          <section>
            <h3 className="text-sm font-semibold mb-3">Search</h3>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Default Search Engine
              </label>
              <div className="flex flex-col gap-2">
                {(['google', 'bing', 'duckduckgo'] as SearchEngine[]).map((engine) => (
                  <button
                    key={engine}
                    onClick={() => setSearchEngine(engine)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-colors ${
                      searchEngine === engine
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    <Search className="w-4 h-4" />
                    <span className="text-sm capitalize">{engine}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* AI Assistant */}
          <section>
            <h3 className="text-sm font-semibold mb-3">AI Assistant</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm">Enable AI Assistant</div>
                  <div className="text-xs text-muted-foreground">
                    Show AI panel by default
                  </div>
                </div>
                <button
                  onClick={() => setAiEnabled(!aiEnabled)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    aiEnabled ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      aiEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  AI Panel Width: {aiPanelWidth}px
                </label>
                <input
                  type="range"
                  min="300"
                  max="600"
                  step="50"
                  value={aiPanelWidth}
                  onChange={(e) => setAiPanelWidth(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section>
            <h3 className="text-sm font-semibold mb-3">Privacy</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm">Save browsing history</div>
                <button className="relative w-11 h-6 rounded-full bg-primary">
                  <div className="absolute top-1 translate-x-6 w-4 h-4 rounded-full bg-white" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">Enable cookies</div>
                <button className="relative w-11 h-6 rounded-full bg-primary">
                  <div className="absolute top-1 translate-x-6 w-4 h-4 rounded-full bg-white" />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
