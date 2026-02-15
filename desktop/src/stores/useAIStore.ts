import { create } from 'zustand'
import { Message } from '../types'
import { clawdbot } from '../lib/clawdbot'

interface AIState {
  messages: Message[]
  isConnected: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  connect: () => Promise<void>
  disconnect: () => void
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  setError: (error: string | null) => void
}

export const useAIStore = create<AIState>((set, get) => ({
  messages: [],
  isConnected: false,
  isLoading: false,
  error: null,

  connect: async () => {
    try {
      await clawdbot.connect()
      set({ isConnected: true, error: null })
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: "Hi! I'm your AI assistant. I can help you navigate, summarize pages, fill forms, and more. What would you like to do?",
        timestamp: new Date()
      }
      set({ messages: [welcomeMessage] })
      
    } catch (error) {
      console.error('Failed to connect to Clawdbot:', error)
      set({ 
        isConnected: false, 
        error: 'Failed to connect to AI backend. Please check if Clawdbot Gateway is running.' 
      })
    }
  },

  disconnect: () => {
    clawdbot.disconnect()
    set({ isConnected: false })
  },

  sendMessage: async (content: string) => {
    if (!content.trim()) return
    
    const state = get()
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }
    
    set({ 
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null
    })

    try {
      // Send to Clawdbot
      const response = await clawdbot.chat(content)
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      
      set(state => ({
        messages: [...state.messages, aiMessage],
        isLoading: false
      }))
      
    } catch (error: any) {
      console.error('Failed to send message:', error)
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message || 'Unknown error'}`,
        timestamp: new Date()
      }
      
      set(state => ({
        messages: [...state.messages, errorMessage],
        isLoading: false,
        error: error.message || 'Failed to send message'
      }))
    }
  },

  clearMessages: () => {
    set({ messages: [] })
  },

  setError: (error: string | null) => {
    set({ error })
  }
}))
