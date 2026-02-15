import { useEffect } from 'react'
import { useBrowserStore } from '../stores/useBrowserStore'

export function useKeyboardShortcuts() {
  const { addTab, closeTab, setActiveTab, tabs, activeTabId, toggleAIPanel } = useBrowserStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modKey = isMac ? e.metaKey : e.ctrlKey

      // Cmd/Ctrl + T - New Tab
      if (modKey && e.key === 't') {
        e.preventDefault()
        addTab()
      }

      // Cmd/Ctrl + W - Close Tab
      if (modKey && e.key === 'w') {
        e.preventDefault()
        if (activeTabId) {
          closeTab(activeTabId)
        }
      }

      // Cmd/Ctrl + Tab - Next Tab
      if (modKey && e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault()
        const currentIndex = tabs.findIndex(t => t.id === activeTabId)
        const nextIndex = (currentIndex + 1) % tabs.length
        setActiveTab(tabs[nextIndex].id)
      }

      // Cmd/Ctrl + Shift + Tab - Previous Tab
      if (modKey && e.key === 'Tab' && e.shiftKey) {
        e.preventDefault()
        const currentIndex = tabs.findIndex(t => t.id === activeTabId)
        const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1
        setActiveTab(tabs[prevIndex].id)
      }

      // Cmd/Ctrl + 1-9 - Switch to Tab 1-9
      if (modKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault()
        const index = parseInt(e.key) - 1
        if (tabs[index]) {
          setActiveTab(tabs[index].id)
        }
      }

      // Cmd/Ctrl + K - Toggle AI Panel
      if (modKey && e.key === 'k') {
        e.preventDefault()
        toggleAIPanel()
      }

      // Cmd/Ctrl + L - Focus Address Bar
      if (modKey && e.key === 'l') {
        e.preventDefault()
        const addressBar = document.querySelector('input[type="text"]') as HTMLInputElement
        addressBar?.focus()
        addressBar?.select()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [tabs, activeTabId])
}
