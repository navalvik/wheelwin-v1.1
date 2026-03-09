type MessageHandler = (data: any) => void

class GameSocket {

  private ws: WebSocket | null = null
  private url: string = ""

  private reconnectDelay = 2000
  private maxReconnectDelay = 10000

  private handlers: Record<string, MessageHandler[]> = {}

  private messageQueue: any[] = []

  private pingInterval: number | null = null

  /*
  CONNECT
  */

  connect(url: string) {

    this.url = url

    this.ws = new WebSocket(url)

    this.ws.onopen = () => {

      console.log("WS connected")

      this.flushQueue()

      this.startPing()

    }

    this.ws.onmessage = (event) => {

      const data = JSON.parse(event.data)

      this.dispatch(data)

    }

    this.ws.onclose = () => {

      console.log("WS disconnected")

      this.stopPing()

      this.reconnect()

    }

    this.ws.onerror = (err) => {

      console.error("WS error", err)

      this.ws?.close()

    }

  }


  /*
  RECONNECT
  */

  private reconnect() {

    setTimeout(() => {

      console.log("WS reconnecting...")

      this.connect(this.url)

    }, this.reconnectDelay)

  }


  /*
  SEND
  */

  send(type: string, payload: any = {}) {

    const message = {
      type,
      ...payload
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {

      this.ws.send(JSON.stringify(message))

    } else {

      this.messageQueue.push(message)

    }

  }


  /*
  QUEUE
  */

  private flushQueue() {

    while (this.messageQueue.length > 0) {

      const msg = this.messageQueue.shift()

      this.ws?.send(JSON.stringify(msg))

    }

  }


  /*
  EVENTS
  */

  on(type: string, handler: MessageHandler) {

    if (!this.handlers[type]) {

      this.handlers[type] = []

    }

    this.handlers[type].push(handler)

  }


  off(type: string, handler: MessageHandler) {

    const list = this.handlers[type]

    if (!list) return

    this.handlers[type] = list.filter(h => h !== handler)

  }


  private dispatch(data: any) {

    const handlers = this.handlers[data.type]

    if (!handlers) return

    handlers.forEach(h => h(data))

  }


  /*
  PING / PONG
  */

  private startPing() {

    this.pingInterval = window.setInterval(() => {

      this.send("ping")

    }, 15000)

  }


  private stopPing() {

    if (this.pingInterval) {

      clearInterval(this.pingInterval)

      this.pingInterval = null

    }

  }

}


/*
EXPORT SINGLETON
*/

export const socket = new GameSocket()


/*
CONNECT HELPER
*/

export function connectSocket() {

  const url =
    import.meta.env.VITE_WS_URL ||
    "ws://localhost:3000"

  socket.connect(url)

}
