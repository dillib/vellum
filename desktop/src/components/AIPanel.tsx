import { useState, useEffect, useRef } from 'react'
import { X, Send, Loader2, WifiOff } from 'lucide-react'
import { useAIStore } from '../stores/useAIStore'

interface AIPanelProps {
  onClose: () => void
}

export default function AIPanel({ onClose }: AIPanelProps) {
  const { messages, isConnected, isLoading, error, connect, sendMessage } = useAIStore()
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Connect to Clawdbot on mount
    connect()
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    await sendMessage(inputValue)
    setInputValue('')
  }

  const handleQuickAction = (action: string) => {
    sendMessage(action)
  }

  return (
    <div className="w-96 border-l border-border bg-secondary flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">AI Assistant</h2>
          {isConnected ? (
            <div className="w-2 h-2 rounded-full bg-green-500" title="Connected" />
          ) : (
            <WifiOff className="w-3 h-3 text-muted-foreground" title="Disconnected" />
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-accent transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 text-red-500 text-xs">
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] px-4 py-2 rounded-lg text-sm
                ${message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-foreground'
                }
              `}
            >
              {message.content}
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-accent px-4 py-2 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2">Quick Actions:</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickAction('Summarize this page')}
            disabled={!isConnected || isLoading}
            className="px-3 py-1 text-xs bg-accent rounded-full hover:bg-accent/80 transition-colors disabled:opacity-50"
          >
            Summarize page
          </button>
          <button
            onClick={() => handleQuickAction('Extract key data from this page')}
            disabled={!isConnected || isLoading}
            className="px-3 py-1 text-xs bg-accent rounded-full hover:bg-accent/80 transition-colors disabled:opacity-50"
          >
            Extract data
          </button>
          <button
            onClick={() => handleQuickAction('Translate this page to English')}
            disabled={!isConnected || isLoading}
            className="px-3 py-1 text-xs bg-accent rounded-full hover:bg-accent/80 transition-colors disabled:opacity-50"
          >
            Translate
          </button>
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            disabled={!isConnected || isLoading}
            className="flex-1 bg-transparent outline-none text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || !isConnected || isLoading}
            className="p-1 rounded hover:bg-accent transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
