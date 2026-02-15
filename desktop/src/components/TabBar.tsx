import { X, Plus } from 'lucide-react'
import { useBrowserStore } from '../stores/useBrowserStore'

export default function TabBar() {
  const { tabs, activeTabId, addTab, closeTab, setActiveTab } = useBrowserStore()

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-secondary border-b border-border overflow-x-auto">
      {/* Tabs */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`
            group flex items-center gap-2 px-3 py-1.5 rounded-t-lg
            min-w-[120px] max-w-[200px] cursor-pointer transition-colors
            ${tab.isActive
              ? 'bg-background border-t border-l border-r border-border'
              : 'bg-secondary hover:bg-accent'
            }
          `}
        >
          {/* Favicon */}
          {tab.favicon ? (
            <img src={tab.favicon} alt="" className="w-4 h-4" />
          ) : (
            <div className="w-4 h-4 rounded-full bg-accent" />
          )}
          
          {/* Title */}
          <span className="flex-1 text-xs truncate">
            {tab.title || 'New Tab'}
          </span>
          
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              closeTab(tab.id)
            }}
            className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-muted transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}

      {/* New Tab Button */}
      <button
        onClick={() => addTab()}
        className="p-1.5 rounded hover:bg-accent transition-colors"
        title="New Tab"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}
