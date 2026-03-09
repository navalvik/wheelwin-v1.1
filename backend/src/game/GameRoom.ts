import { WebSocket } from "ws"
import { generateSpin } from "./RNG"

export enum GameState {
  LOBBY = "lobby",
  READY = "ready",
  SPIN = "spin",
  STOP = "stop",
  PAYOUT = "payout"
}

type Player = {
  id: string
  ws: WebSocket
  wallet?: string

  ready: boolean
  pressed: boolean
}

export default class GameRoom {

  id: string

  players: Player[] = []

  state: GameState = GameState.LOBBY

  minPlayers = 3
  maxPlayers = 5

  baseBet = 1

  pot = 0

  spinStartTime = 0

  serverSeed = ""
  clientSeed = ""
  nonce = 0

  constructor(id: string) {

    this.id = id

  }

  /*
  PLAYER JOIN
  */

  addPlayer(ws: WebSocket, playerId: string) {

    if (this.players.length >= this.maxPlayers) return

    const player: Player = {
      id: playerId,
      ws,
      ready: false,
      pressed: false
    }

    this.players.push(player)

    this.broadcastState()

  }

  /*
  PLAYER LEAVE
  */

  removePlayer(playerId: string) {

    this.players = this.players.filter(p => p.id !== playerId)

    this.broadcastState()

  }

  /*
  READY
  */

  playerReady(playerId: string) {

    const player = this.players.find(p => p.id === playerId)
    if (!player) return

    player.ready = true

    if (this.players.every(p => p.ready) &&
        this.players.length >= this.minPlayers) {

      this.startSpin()

    }

    this.broadcastState()

  }

  /*
  PLAYER PRESS
  */

  press(playerId: string) {

    if (this.state !== GameState.SPIN) return

    const player = this.players.find(p => p.id === playerId)
    if (!player) return

    player.pressed = true

  }

  /*
  PLAYER RELEASE
  */

  release(playerId: string) {

    const player = this.players.find(p => p.id === playerId)
    if (!player) return

    player.pressed = false

  }

  /*
  START SPIN
  */

  startSpin() {

    this.state = GameState.SPIN

    this.spinStartTime = Date.now()

    this.serverSeed = Math.random().toString()
    this.clientSeed = Math.random().toString()

    this.broadcast({
      type: "spin_start",
      activePlayers: this.players.length
    })

    setTimeout(() => {

      this.stopSpin()

    }, 5000)

  }

  /*
  STOP SPIN
  */

  stopSpin() {

    this.state = GameState.STOP

    const spinResult = generateSpin(
      this.serverSeed,
      this.clientSeed,
      this.nonce++
    )

    const winnerIndex =
      Math.floor(spinResult * this.players.length)

    const winner = this.players[winnerIndex]

    this.broadcast({

      type: "spin_stop",
      finalAngle: spinResult * Math.PI * 2

    })

    setTimeout(() => {

      this.payout(winner)

    }, 3000)

  }

  /*
  PAYOUT
  */

  payout(winner: Player) {

    this.state = GameState.PAYOUT

    const totalPot = this.players.length * this.baseBet

    const prize = totalPot * 0.95

    this.broadcast({

      type: "payout",
      winnerId: winner.id,
      amount: prize

    })

    this.resetRoom()

  }

  /*
  RESET
  */

  resetRoom() {

    this.players.forEach(p => {

      p.ready = false
      p.pressed = false

    })

    this.state = GameState.LOBBY

    this.broadcastState()

  }

  /*
  STATE
  */

  broadcastState() {

    this.broadcast({

      type: "room_state",

      players: this.players.map(p => ({
        id: p.id,
        ready: p.ready,
        pressed: p.pressed
      })),

      state: this.state

    })

  }

  /*
  BROADCAST
  */

  broadcast(data: any) {

    const msg = JSON.stringify(data)

    this.players.forEach(player => {

      if (player.ws.readyState === WebSocket.OPEN) {

        player.ws.send(msg)

      }

    })

  }

}
