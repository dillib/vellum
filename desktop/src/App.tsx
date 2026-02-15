import { useState } from 'react'
import Navbar from './components/Navbar'
import AIPanel from './components/AIPanel'

function App() {
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com')
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(true)

  const handleNavigate = async (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    setCurrentUrl(url)
    await window.electronAPI?.navigate(url)
  }

  const handleBack = async () => {
    await window.electronAPI?.goBack()
  }

  const handleForward = async () => {
    await window.electronAPI?.goForward()
  }

  const handleReload = async () => {
    await window.electronAPI?.reload()
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar
        currentUrl={currentUrl}
        onNavigate={handleNavigate}
        onBack={handleBack}
        onForward={handleForward}
        onReload={handleReload}
        onToggleAI={() => setIsAIPanelOpen(!isAIPanelOpen)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Web content area - handled by Electron BrowserView */}
        <div className="flex-1" />
        
        {/* AI Assistant Panel */}
        {isAIPanelOpen && (
          <AIPanel onClose={() => setIsAIPanelOpen(false)} />
        )}
      </div>
    </div>
  )
}

export default App
