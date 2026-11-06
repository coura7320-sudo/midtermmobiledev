// =============================================================================
// WebSocket Real-time Messaging Service
// Implements requirements:
//  - Real-time WebSocket communication for live messaging and typing indicators
// =============================================================================

import { WS_BASE_URL, Message } from './apiService';

type Listener = (data: any) => void;

class SocketService {
  private socket: WebSocket | null = null;
  private listeners: Map<string, Set<Listener>> = new Map();
  private reconnectTimeout: any = null;
  private isConnecting: boolean = false;
  public isConnected: boolean = false;

  public connect(url: string = WS_BASE_URL) {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isConnecting = true;
    try {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log('[WebSocket Client] Connected to', url);
        this.isConnected = true;
        this.isConnecting = false;
        this.emitInternal('connection:change', { connected: true });
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.type) {
            this.emitInternal(data.type, data);
          }
        } catch (e) {
          console.warn('[WebSocket Client] Failed parsing frame:', event.data);
        }
      };

      this.socket.onerror = (error) => {
        console.warn('[WebSocket Client] Connection error:', error);
      };

      this.socket.onclose = () => {
        console.log('[WebSocket Client] Connection closed');
        this.isConnected = false;
        this.isConnecting = false;
        this.socket = null;
        this.emitInternal('connection:change', { connected: false });

        // Auto reconnect after 3 seconds
        if (!this.reconnectTimeout) {
          this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;
            this.connect(url);
          }, 3000);
        }
      };
    } catch (err) {
      this.isConnecting = false;
      this.isConnected = false;
      console.warn('[WebSocket Client] Exception while creating socket:', err);
    }
  }

  public disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  }

  public on(event: string, callback: Listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  public off(event: string, callback: Listener) {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(callback);
      if (set.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  private emitInternal(event: string, data: any) {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(data);
        } catch (e) {
          console.error(`[WebSocket] Listener error on event ${event}:`, e);
        }
      });
    }
  }

  public send(type: string, payload: Record<string, any> = {}) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, ...payload }));
      return true;
    }
    return false;
  }

  // Specific high-level helpers
  public sendMessage(chatId: string, text: string, senderName: string, tempId: string) {
    return this.send('message:send', { chatId, text, senderName, tempId });
  }

  public sendTyping(chatId: string, isTyping: boolean) {
    return this.send(isTyping ? 'typing:start' : 'typing:stop', { chatId });
  }

  public markAsRead(chatId: string) {
    return this.send('message:read', { chatId });
  }
}

export const socketService = new SocketService();
