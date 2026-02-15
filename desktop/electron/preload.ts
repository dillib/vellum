import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Navigation
  navigate: (url: string) => ipcRenderer.invoke('navigate', url),
  goBack: () => ipcRenderer.invoke('go-back'),
  goForward: () => ipcRenderer.invoke('go-forward'),
  reload: () => ipcRenderer.invoke('reload'),
  
  // Page info
  getUrl: () => ipcRenderer.invoke('get-url'),
  getTitle: () => ipcRenderer.invoke('get-title'),
  
  // Events
  onPageLoad: (callback: () => void) => {
    ipcRenderer.on('page-loaded', callback)
  },
  onUrlChange: (callback: (url: string) => void) => {
    ipcRenderer.on('url-changed', (_, url) => callback(url))
  }
})

// Type definitions for TypeScript
export interface ElectronAPI {
  navigate: (url: string) => Promise<void>
  goBack: () => Promise<void>
  goForward: () => Promise<void>
  reload: () => Promise<void>
  getUrl: () => Promise<string>
  getTitle: () => Promise<string>
  onPageLoad: (callback: () => void) => void
  onUrlChange: (callback: (url: string) => void) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
