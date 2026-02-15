export interface Tab {
  id: string
  url: string
  title: string
  favicon?: string
  isActive: boolean
  isLoading: boolean
  createdAt: Date
  lastActive: Date
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface BrowserSettings {
  theme: 'dark' | 'light' | 'auto'
  aiPanelWidth: number
  defaultSearchEngine: string
  enableAIByDefault: boolean
}
