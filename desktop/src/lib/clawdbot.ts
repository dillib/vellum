/**
 * Clawdbot WebSocket Client
 * Connects to the embedded Clawdbot Gateway for AI assistance
 */

export interface ClawdbotMessage {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

export interface ClawdbotRequest {
  action: 'chat' | 'snapshot' | 'act' | 'navigate'
  content?: string
  params?: Record<string, any>
}

export interface ClawdbotResponse {
  id: string
  type: 'message' | 'action' | 'error'
  content: string
  metadata?: Record<string, any>
}

export class ClawdbotClient {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private listeners: Map<string, (data: any) => void> = new Map()

  constructor(private url: string = 'ws://localhost:18789') {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          console.log('[Clawdbot] Connected')
          this.reconnectAttempts = 0
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.handleMessage(data)
          } catch (error) {
            console.error('[Clawdbot] Failed to parse message:', error)
          }
        }

        this.ws.onerror = (error) => {
          console.error('[Clawdbot] WebSocket error:', error)
          reject(error)
        }

        this.ws.onclose = () => {
          console.log('[Clawdbot] Disconnected')
          this.handleReconnect()
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[Clawdbot] Max reconnect attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    console.log(`[Clawdbot] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)
    
    setTimeout(() => {
      this.connect().catch(console.error)
    }, delay)
  }

  private handleMessage(data: ClawdbotResponse) {
    // Notify all listeners
    this.listeners.forEach((callback) => {
      callback(data)
    })
  }

  send(request: ClawdbotRequest): Promise<ClawdbotResponse> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket is not connected'))
        return
      }

      const id = Date.now().toString()
      const message = { id, ...request }

      // Set up one-time listener for response
      const responseHandler = (data: ClawdbotResponse) => {
        if (data.id === id) {
          this.off('message', responseHandler)
          if (data.type === 'error') {
            reject(new Error(data.content))
          } else {
            resolve(data)
          }
        }
      }

      this.on('message', responseHandler)
      this.ws.send(JSON.stringify(message))

      // Timeout after 30 seconds
      setTimeout(() => {
        this.off('message', responseHandler)
        reject(new Error('Request timeout'))
      }, 30000)
    })
  }

  async chat(message: string): Promise<string> {
    const response = await this.send({
      action: 'chat',
      content: message
    })
    return response.content
  }

  async snapshot(): Promise<any> {
    const response = await this.send({
      action: 'snapshot'
    })
    return response.metadata
  }

  async act(action: string, params?: Record<string, any>): Promise<void> {
    await this.send({
      action: 'act',
      content: action,
      params
    })
  }

  on(event: string, callback: (data: any) => void) {
    this.listeners.set(event, callback)
  }

  off(event: string, callback: (data: any) => void) {
    this.listeners.delete(event)
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}

// Singleton instance
export const clawdbot = new ClawdbotClient()
