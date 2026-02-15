import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, ArrowRight, RotateCw, Lock, Search, Sparkles, Star, Clock, Settings as SettingsIcon } from 'lucide-react'

interface NavbarProps {
  currentUrl: string
  onNavigate: (url: string) => void
  onBack: () => void
  onForward: () => void
  onReload: () => void
  onToggleAI: () => void
  onOpenSettings: () => void
  onOpenBookmarks: () => void
  onOpenHistory: () => void
}

export default function Navbar({
  currentUrl,
  onNavigate,
  onBack,
  onForward,
  onReload,
  onToggleAI,
  onOpenSettings,
  onOpenBookmarks,
  onOpenHistory
}: NavbarProps) {
  const [inputValue, setInputValue] = useState(currentUrl)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue(currentUrl)
  }, [currentUrl])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNavigate(inputValue)
    inputRef.current?.blur()
  }

  const handleFocus = () => {
    setIsFocused(true)
    inputRef.current?.select()
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  return (
    <nav className="flex items-center gap-2 px-4 py-3 bg-secondary border-b border-border">
      {/* Navigation Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onForward}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          title="Forward"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={onReload}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          title="Reload"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Address Bar */}
      <form onSubmit={handleSubmit} className="flex-1">
        <div
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            bg-background border transition-all
            ${isFocused ? 'border-primary ring-2 ring-primary/20' : 'border-border'}
          `}
        >
          {currentUrl.startsWith('https://') ? (
            <Lock className="w-4 h-4 text-green-500" />
          ) : (
            <Search className="w-4 h-4 text-muted-foreground" />
          )}
          
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Search or enter address"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      </form>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={onOpenBookmarks}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          title="Bookmarks (Cmd+D)"
        >
          <Star className="w-4 h-4" />
        </button>
        <button
          onClick={onOpenHistory}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          title="History (Cmd+Y)"
        >
          <Clock className="w-4 h-4" />
        </button>
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          title="Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
        <button
          onClick={onToggleAI}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          title="Toggle AI Assistant (Cmd+K)"
        >
          <Sparkles className="w-5 h-5 text-primary" />
        </button>
      </div>
    </nav>
  )
}
