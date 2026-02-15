import { app, BrowserWindow, BrowserView, ipcMain } from 'electron'
import path from 'path'

let mainWindow: BrowserWindow | null = null
let browserView: BrowserView | null = null

const isDev = process.env.NODE_ENV === 'development'

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset', // macOS style
    backgroundColor: '#0a0a0a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  // Load the UI (React app)
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Create BrowserView for web content
  browserView = new BrowserView({
    webPreferences: {
      sandbox: true,
      contextIsolation: true
    }
  })
  
  mainWindow.setBrowserView(browserView)
  updateBrowserViewBounds()

  // Handle window resize
  mainWindow.on('resize', updateBrowserViewBounds)
  mainWindow.on('closed', () => {
    mainWindow = null
    browserView = null
  })
}

function updateBrowserViewBounds() {
  if (!mainWindow || !browserView) return
  
  const [width, height] = mainWindow.getSize()
  const NAVBAR_HEIGHT = 60
  const AI_PANEL_WIDTH = 400 // Right panel width
  
  // Web content takes left side, AI panel on right
  browserView.setBounds({
    x: 0,
    y: NAVBAR_HEIGHT,
    width: width - AI_PANEL_WIDTH,
    height: height - NAVBAR_HEIGHT
  })
}

// IPC Handlers
ipcMain.handle('navigate', async (_, url: string) => {
  if (browserView) {
    browserView.webContents.loadURL(url)
  }
})

ipcMain.handle('go-back', async () => {
  if (browserView?.webContents.canGoBack()) {
    browserView.webContents.goBack()
  }
})

ipcMain.handle('go-forward', async () => {
  if (browserView?.webContents.canGoForward()) {
    browserView.webContents.goForward()
  }
})

ipcMain.handle('reload', async () => {
  browserView?.webContents.reload()
})

ipcMain.handle('get-url', async () => {
  return browserView?.webContents.getURL() || ''
})

ipcMain.handle('get-title', async () => {
  return browserView?.webContents.getTitle() || ''
})

// App lifecycle
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// Development hot reload
if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  })
}
