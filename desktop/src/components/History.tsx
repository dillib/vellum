import { useState } from 'react'
import { X, Clock, Trash2, Search } from 'lucide-react'
import { formatTimestamp } from '../lib/utils'

interface HistoryItem {
  id: string
  url: string
  title: string
  visitTime: Date
  visitCount: number
}

interface HistoryProps {
  onClose: () => void
  onNavigate: (url: string) => void
}

export default function History({ onClose, onNavigate }: HistoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [history] = useState<HistoryItem[]>([
    {
      id: '1',
      url: 'https://www.google.com',
      title: 'Google',
      visitTime: new Date(Date.now() - 1000 * 60 * 30),
      visitCount: 5
    },
    {
      id: '2',
      url: 'https://github.com/dillib/vellum',
      title: 'Vellum Browser - GitHub',
      visitTime: new Date(Date.now() - 1000 * 60 * 60),
      visitCount: 3
    },
    {
      id: '3',
      url: 'https://react.dev',
      title: 'React Documentation',
      visitTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
      visitCount: 10
    }
  ])

  const filteredHistory = history.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group by time periods
  const groupedHistory = filteredHistory.reduce((groups, item) => {
    const now = new Date()
    const diff = now.getTime() - item.visitTime.getTime()
    const hours = diff / (1000 * 60 * 60)
    
    let group = 'Older'
    if (hours < 1) group = 'Last hour'
    else if (hours < 24) group = 'Today'
    else if (hours < 48) group = 'Yesterday'
    else if (hours < 168) group = 'This week'
    
    if (!groups[group]) groups[group] = []
    groups[group].push(item)
    return groups
  }, {} as Record<string, HistoryItem[]>)

  const handleItemClick = (url: string) => {
    onNavigate(url)
    onClose()
  }

  const handleClearAll = () => {
    if (confirm('Clear all browsing history?')) {
      // TODO: Clear history
      console.log('Clearing history...')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg w-full max-w-3xl h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3 flex-1 mr-4">
            <Clock className="w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearAll}
              className="px-3 py-2 text-sm rounded hover:bg-accent transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-accent transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {Object.entries(groupedHistory).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Clock className="w-12 h-12 mb-2 opacity-20" />
              <p className="text-sm">No history found</p>
            </div>
          ) : (
            Object.entries(groupedHistory).map(([group, items]) => (
              <div key={group}>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                  {group}
                </h3>
                <div className="space-y-2">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className="group flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => handleItemClick(item.url)}
                    >
                      {/* Favicon */}
                      <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {item.title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {item.url}
                        </div>
                      </div>

                      {/* Time & Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(item.visitTime)}
                        </span>
                        {item.visitCount > 1 && (
                          <span className="text-xs text-muted-foreground">
                            · {item.visitCount} visits
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            // TODO: Delete item
                          }}
                          className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
