import { useState } from 'react'
import { X, Send } from 'lucide-react'

interface AIPanelProps {
  onClose: () => void
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AIPanel({ onClose }: AIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI assistant. I can help you navigate, summarize pages, fill forms, and more. What would you like to do?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages([...messages, userMessage])
    setInputValue('')

    // TODO: Send to Clawdbot Gateway via WebSocket
    // For now, just echo back
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `You said: "${inputValue}". AI integration coming soon!`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    }, 500)
  }

  return (
    <div className="w-96 border-l border-border bg-secondary flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold">AI Assistant</h2>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-accent transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

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
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2">Quick Actions:</div>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1 text-xs bg-accent rounded-full hover:bg-accent/80 transition-colors">
            Summarize page
          </button>
          <button className="px-3 py-1 text-xs bg-accent rounded-full hover:bg-accent/80 transition-colors">
            Extract data
          </button>
          <button className="px-3 py-1 text-xs bg-accent rounded-full hover:bg-accent/80 transition-colors">
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
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-1 rounded hover:bg-accent transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
