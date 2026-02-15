import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import TabBar from './components/TabBar'
import AIPanel from './components/AIPanel'
import Settings from './components/Settings'
import Bookmarks from './components/Bookmarks'
import History from './components/History'
import { useBrowserStore } from './stores/useBrowserStore'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

function App() {
  useKeyboardShortcuts()
  const { tabs, activeTabId, updateTab, isAIPanelOpen, toggleAIPanel } = useBrowserStore()
  const [showSettings, setShowSettings] = useState(false)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const activeTab = tabs.find(tab => tab.id === activeTabId)

  const handleNavigate = async (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Check if it's a search query or URL
      if (url.includes(' ') || !url.includes('.')) {
        // Search query
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`
      } else {
        // Assume it's a URL without protocol
        url = 'https://' + url
      }
    }

    if (activeTabId) {
      updateTab(activeTabId, { url, isLoading: true })
      await window.electronAPI?.navigate(url)
    }
  }

  const handleBack = async () => {
    await window.electronAPI?.goBack()
  }

  const handleForward = async () => {
    await window.electronAPI?.goForward()
  }

  const handleReload = async () => {
    if (activeTabId) {
      updateTab(activeTabId, { isLoading: true })
    }
    await window.electronAPI?.reload()
  }

  // Listen for page load events
  useEffect(() => {
    const updatePageInfo = async () => {
      if (!activeTabId) return
      
      const url = await window.electronAPI?.getUrl()
      const title = await window.electronAPI?.getTitle()
      
      if (url || title) {
        updateTab(activeTabId, {
          url: url || activeTab?.url || '',
          title: title || 'Untitled',
          isLoading: false
        })
      }
    }

    // Poll for updates (better would be to listen to events from main process)
    const interval = setInterval(updatePageInfo, 1000)
    return () => clearInterval(interval)
  }, [activeTabId])

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Tab Bar */}
      <TabBar />
      
      {/* Navigation Bar */}
      <Navbar
        currentUrl={activeTab?.url || ''}
        onNavigate={handleNavigate}
        onBack={handleBack}
        onForward={handleForward}
        onReload={handleReload}
        onToggleAI={toggleAIPanel}
        onOpenSettings={() => setShowSettings(true)}
        onOpenBookmarks={() => setShowBookmarks(true)}
        onOpenHistory={() => setShowHistory(true)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Web content area - handled by Electron BrowserView */}
        <div className="flex-1" />
        
        {/* AI Assistant Panel */}
        {isAIPanelOpen && (
          <AIPanel onClose={() => toggleAIPanel()} />
        )}
      </div>

      {/* Modals */}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      {showBookmarks && (
        <Bookmarks
          onClose={() => setShowBookmarks(false)}
          onNavigate={handleNavigate}
        />
      )}
      {showHistory && (
        <History
          onClose={() => setShowHistory(false)}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  )
}

export default App
