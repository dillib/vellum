import { create } from 'zustand'
import { Tab } from '../types'

interface BrowserState {
  tabs: Tab[]
  activeTabId: string | null
  isAIPanelOpen: boolean
  
  // Actions
  addTab: (url?: string) => void
  closeTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void
  updateTab: (tabId: string, updates: Partial<Tab>) => void
  toggleAIPanel: () => void
  setAIPanelOpen: (open: boolean) => void
}

export const useBrowserStore = create<BrowserState>((set, get) => ({
  tabs: [
    {
      id: '1',
      url: 'https://www.google.com',
      title: 'Google',
      isActive: true,
      isLoading: false,
      createdAt: new Date(),
      lastActive: new Date()
    }
  ],
  activeTabId: '1',
  isAIPanelOpen: true,

  addTab: (url = 'https://www.google.com') => {
    const newTab: Tab = {
      id: Date.now().toString(),
      url,
      title: 'New Tab',
      isActive: true,
      isLoading: true,
      createdAt: new Date(),
      lastActive: new Date()
    }

    set(state => ({
      tabs: state.tabs.map(tab => ({ ...tab, isActive: false })).concat(newTab),
      activeTabId: newTab.id
    }))
  },

  closeTab: (tabId: string) => {
    const state = get()
    const tabs = state.tabs.filter(tab => tab.id !== tabId)
    
    if (tabs.length === 0) {
      // If closing last tab, create a new one
      const newTab: Tab = {
        id: Date.now().toString(),
        url: 'https://www.google.com',
        title: 'New Tab',
        isActive: true,
        isLoading: false,
        createdAt: new Date(),
        lastActive: new Date()
      }
      set({ tabs: [newTab], activeTabId: newTab.id })
      return
    }

    // If closing active tab, activate the next or previous tab
    let newActiveId = state.activeTabId
    if (tabId === state.activeTabId) {
      const closedIndex = state.tabs.findIndex(t => t.id === tabId)
      const nextTab = tabs[Math.min(closedIndex, tabs.length - 1)]
      newActiveId = nextTab.id
    }

    set({
      tabs: tabs.map(tab => ({
        ...tab,
        isActive: tab.id === newActiveId
      })),
      activeTabId: newActiveId
    })
  },

  setActiveTab: (tabId: string) => {
    set(state => ({
      tabs: state.tabs.map(tab => ({
        ...tab,
        isActive: tab.id === tabId,
        lastActive: tab.id === tabId ? new Date() : tab.lastActive
      })),
      activeTabId: tabId
    }))
  },

  updateTab: (tabId: string, updates: Partial<Tab>) => {
    set(state => ({
      tabs: state.tabs.map(tab =>
        tab.id === tabId ? { ...tab, ...updates } : tab
      )
    }))
  },

  toggleAIPanel: () => {
    set(state => ({ isAIPanelOpen: !state.isAIPanelOpen }))
  },

  setAIPanelOpen: (open: boolean) => {
    set({ isAIPanelOpen: open })
  }
}))
